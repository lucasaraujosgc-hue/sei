
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, LayoutDashboard } from 'lucide-react';
import { TOPICS } from './constants';
import { Meta, TopicId } from './types';
import { TopicCard } from './components/TopicCard';
import { AdminPanel } from './components/AdminPanel';
import { SummaryPanel } from './components/SummaryPanel';
import { ReportModal } from './components/ReportModal';

function App() {
  const [posts, setPosts] = useState<Meta[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usingServer, setUsingServer] = useState(true);

  // Função auxiliar para calcular Status e Progresso
  const processMeta = (meta: any): Meta => {
      // 1. Parse de dados extras se virem do backend como string
      const data = meta.extraData ? { ...meta, ...JSON.parse(meta.extraData) } : meta;
      
      // Garante tipos
      const etapas = Array.isArray(data.etapas) ? data.etapas : [];
      const deadline = new Date(data.prazoGeral);
      const today = new Date();
      // Zera horas para comparação de datas apenas
      today.setHours(0,0,0,0);
      deadline.setHours(0,0,0,0);

      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      // 2. Calcular Progresso
      const totalEtapas = etapas.length;
      const concluidas = etapas.filter((e: any) => e.concluido).length;
      const progress = totalEtapas > 0 ? (concluidas / totalEtapas) * 100 : 0;

      // 3. Calcular Status
      let status: 'green' | 'yellow' | 'red' = 'green';

      if (progress === 100) {
          status = 'green'; // Concluído é sempre verde
      } else {
          if (diffDays < 0) {
              status = 'red'; // Atrasado (hoje > prazo)
          } else if (diffDays <= (data.diasAlerta || 7)) {
              status = 'yellow'; // Perto do prazo
          } else {
              status = 'green'; // No prazo
          }
      }

      return {
          ...data,
          etapas,
          computedStatus: status,
          computedProgress: progress
      };
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Erro servidor');
      const json = await response.json();
      
      const parsedPosts = json.data.map(processMeta);

      // Ordenação Padrão: Atrasados primeiro, depois atenção, depois ok
      const statusWeight = { 'red': 3, 'yellow': 2, 'green': 1 };
      const sortedPosts = parsedPosts.sort((a: Meta, b: Meta) => {
          return (statusWeight[b.computedStatus!] || 0) - (statusWeight[a.computedStatus!] || 0);
      });

      setPosts(sortedPosts || []);
      setUsingServer(true);
    } catch (err) {
      setUsingServer(false);
      const localData = localStorage.getItem('metas_sgc'); // Nova chave para evitar conflito
      if (localData) {
          const parsedLocal = JSON.parse(localData).map(processMeta);
          setPosts(parsedLocal);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleAddPost = async (metaData: any) => {
    const newPost = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      ...metaData
    };

    if (usingServer) {
      try {
        const payload = {
            id: newPost.id,
            topicId: newPost.topicId,
            description: newPost.descricao, 
            chartConfig: { type: 'bar', title: newPost.titulo, data: [] }, 
            createdAt: newPost.createdAt,
            ...metaData 
        };

        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Erro salvar');
        
        setPosts(prev => [processMeta(newPost), ...prev]);
        return true;
      } catch (err) { return false; }
    } else {
      const updated = [processMeta(newPost), ...posts];
      setPosts(updated);
      localStorage.setItem('metas_sgc', JSON.stringify(updated));
      return true;
    }
  };

  const handleEditPost = async (id: string, metaData: any) => {
    const updatedFields = { ...metaData };
    if (usingServer) {
      try {
        const payload = {
            topicId: metaData.topicId,
            description: metaData.descricao,
            chartConfig: { type: 'bar', title: metaData.titulo, data: [] },
            ...metaData
        };

        const response = await fetch(`/api/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Erro update');
        
        setPosts(prev => prev.map(p => p.id === id ? processMeta({ ...p, ...updatedFields }) : p));
        return true;
      } catch (err) { return false; }
    } else {
      const updated = posts.map(p => p.id === id ? processMeta({ ...p, ...updatedFields }) : p);
      setPosts(updated);
      localStorage.setItem('metas_sgc', JSON.stringify(updated));
      return true;
    }
  };

  const handleDeletePost = async (id: string) => {
    if (usingServer) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      setPosts(prev => prev.filter(p => p.id !== id));
    } else {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      localStorage.setItem('metas_sgc', JSON.stringify(updated));
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
        <header className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4">
              <img src="https://pmsgc-goncalinho.wvai75.easypanel.host/brasao.png" className="h-10 w-auto" alt="Logo" />
              <div>
                <h1 className="text-xl font-bold text-white leading-none">Gestão de Metas</h1>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Sala de Situação Executiva</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
                <Link to="/painel" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-emerald-400 border border-slate-700 rounded-lg transition-all active:scale-95 hover:bg-slate-800">
                    <LayoutDashboard size={14} /> Painel
                </Link>
                <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-emerald-400 border border-slate-700 rounded-lg transition-all active:scale-95 hover:bg-slate-800">
                    <Lock size={14} /> Gestão
                </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DashboardView isLoading={isLoading} />} />
            <Route path="/topic/:topicId" element={<TopicDetailView posts={posts} />} />
            <Route path="/painel" element={<SummaryPanel posts={posts} />} />
          </Routes>
        </main>

        {isAdminOpen && (
          <AdminPanel 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            posts={posts}
            onAddPost={handleAddPost}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            usingServer={usingServer}
          />
        )}
      </div>
    </Router>
  );
}

const DashboardView = ({ isLoading }: { isLoading: boolean }) => {
  const navigate = useNavigate();
  const mainTopics = TOPICS.filter(t => t.id !== TopicId.CONTROLADORIA && t.id !== TopicId.PROCURADORIA);
  const sideTopics = TOPICS.filter(t => t.id === TopicId.CONTROLADORIA || t.id === TopicId.PROCURADORIA);

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-8 gap-6">
        <div>
            <h2 className="text-4xl font-black text-white mb-2">Painel de Metas</h2>
            <p className="text-slate-400 max-w-xl">Acompanhamento transparente das metas e resultados da gestão municipal.</p>
        </div>
        
        {/* Secretarias Especiais (Controladoria/Procuradoria) */}
        <div className="flex gap-4">
            {sideTopics.map(topic => (
                <button 
                    key={topic.id}
                    onClick={() => navigate(`/topic/${topic.id}`)}
                    className="flex items-center gap-3 bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-xl p-3 transition-all group"
                >
                    <div className={`p-2 rounded-lg ${topic.color} bg-opacity-20`}>
                        {/* Ícones específicos ou genéricos */}
                        <div className={`w-4 h-4 rounded-full ${topic.color}`}></div>
                    </div>
                    <div className="text-left">
                        <h4 className="text-xs font-bold text-white uppercase">{topic.label}</h4>
                        <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">Acessar &rarr;</span>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainTopics.map(topic => <TopicCard key={topic.id} topic={topic} onClick={(id) => navigate(`/topic/${id}`)} />)}
        </div>
      )}
    </div>
  );
};

const TopicDetailView = ({ posts }: { posts: Meta[] }) => {
    const { topicId } = useParams();
    
    // Lógica Avançada de Filtragem:
    // 1. Metas pertencentes a esta secretaria
    // 2. Metas de OUTRAS secretarias que tenham etapas PENDENTES vinculadas a ESTA secretaria
    
    const relevantPosts = useMemo(() => {
        return posts.filter(p => {
            // Caso 1: Pertence a secretaria atual
            if (p.topicId === topicId) return true;

            // Caso 2: Tem etapa pendente vinculada a secretaria atual
            const hasPendingLink = p.etapas.some(e => 
                !e.concluido && 
                e.vinculos?.some(v => v.tipo === 'secretaria' && v.valor === topicId)
            );

            if (hasPendingLink) {
                // Marca como externa para a UI saber diferenciar
                p.isExternal = true; 
                p.originTopicId = p.topicId;
                return true;
            }

            return false;
        });
    }, [posts, topicId]);
    
    return <SummaryPanel posts={relevantPosts} />;
};

export default App;


import React, { useState, useMemo } from 'react';
import { Filter, Search, Target, LayoutDashboard, ArrowLeft, Calendar, User, ListChecks, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { Meta, TopicId } from '../types';
import { TOPICS } from '../constants';
import { Link } from 'react-router-dom';
import { ReportModal } from './ReportModal';

interface SummaryPanelProps {
  posts: Meta[];
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ posts }) => {
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedPost, setSelectedPost] = useState<Meta | null>(null);

  const filteredPosts = posts.filter(post => {
    // Filtro de tópico: Se for 'all', mostra tudo. Se não, filtra pelo topicId, MAS se for uma meta externa exibida, ela deve passar.
    // A lista 'posts' recebida já está filtrada pelo contexto (App.tsx), então 'filterTopic' aqui serve mais para o dropdown do painel geral.
    const matchesTopic = filterTopic === 'all' || post.topicId === filterTopic || (post.isExternal && post.originTopicId === filterTopic);
    
    const matchesStatus = filterStatus === 'all' || (post.computedStatus || 'green') === filterStatus;
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTopic && matchesStatus && matchesSearch;
  });

  // Agrupamento
  const groupedPosts = useMemo(() => {
      if (filterTopic === 'all') {
          // No painel geral, queremos agrupar por secretaria original
          return TOPICS.map(topic => ({
            topic,
            posts: filteredPosts.filter(p => p.topicId === topic.id)
          })).filter(g => g.posts.length > 0);
      } else {
          // Numa visão filtrada (ou dentro da secretaria), mostramos tudo numa lista, mas podemos ter misturado
          // Se estivermos vendo "Educação", filteredPosts terá metas de Educação e Metas Externas vinculadas a Educação.
          // Vamos agrupar visualmente pelo tópico da meta para ficar claro.
          const groups = new Map<string, Meta[]>();
          filteredPosts.forEach(p => {
              const tId = p.topicId;
              if(!groups.has(tId)) groups.set(tId, []);
              groups.get(tId)?.push(p);
          });
          
          return Array.from(groups.entries()).map(([tId, groupPosts]) => ({
              topic: TOPICS.find(t => t.id === tId)!,
              posts: groupPosts
          }));
      }
  }, [filteredPosts, filterTopic]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'red': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
      case 'yellow': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]';
      case 'green': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'red': return 'Atrasado';
          case 'yellow': return 'Atenção';
          case 'green': return 'Em Dia';
          default: return '-';
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header e Filtros */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <Link to="/" className="text-xs text-slate-500 hover:text-white flex items-center gap-1 mb-2"><ArrowLeft size={12}/> Voltar ao Início</Link>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <LayoutDashboard className="text-emerald-500"/> Painel de Metas
                </h2>
                <p className="text-sm text-slate-400">Acompanhamento executivo de metas e etapas.</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                        type="text" 
                        placeholder="Buscar meta..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-slate-900 text-white text-xs py-2 pl-9 pr-4 rounded-xl border border-slate-800 outline-none focus:border-emerald-500 w-48"
                    />
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/50">
            <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Filtrar por Secretaria</label>
                <div className="relative">
                    <select 
                        value={filterTopic} 
                        onChange={e => setFilterTopic(e.target.value)}
                        className="w-full appearance-none bg-slate-900 text-white text-xs font-bold uppercase pl-4 pr-10 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                        <option value="all">Todas as Secretarias</option>
                        {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14}/>
                </div>
            </div>

            <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Filtrar por Situação</label>
                <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
                    {[
                        { id: 'all', label: 'Todos', color: 'bg-slate-700' },
                        { id: 'green', label: 'Em Dia', color: 'bg-emerald-600' },
                        { id: 'yellow', label: 'Atenção', color: 'bg-amber-600' },
                        { id: 'red', label: 'Atrasado', color: 'bg-red-600' }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setFilterStatus(opt.id)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filterStatus === opt.id ? `${opt.color} text-white shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-8">
        {groupedPosts.map((group) => (
            <div key={group.topic?.id || 'unknown'} className="space-y-3">
                {/* Cabeçalho do Grupo */}
                <div className="flex items-center gap-3 px-2">
                    <div className={`w-2 h-2 rounded-full ${group.topic?.color || 'bg-slate-500'}`}></div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">{group.topic?.label || 'Outros'}</h3>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                
                <div className="grid gap-2">
                    {group.posts.map(post => {
                        const statusColor = getStatusColor(post.computedStatus || 'green');
                        const progress = post.computedProgress || 0;
                        const formattedDeadline = new Date(post.prazoGeral).toLocaleDateString();

                        return (
                        <div 
                            key={post.id} 
                            onClick={() => setSelectedPost(post)}
                            className="bg-slate-900/40 hover:bg-slate-800 border border-slate-800/50 hover:border-slate-700 p-5 rounded-2xl flex items-center justify-between transition-all cursor-pointer duration-300 group relative overflow-hidden"
                        >
                            {/* Indicador de Meta Externa (Vinculada) */}
                            {post.isExternal && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-lg z-10 flex items-center gap-1">
                                    <LinkIcon size={10}/> Vinculada
                                </div>
                            )}

                            <div className="flex-1 pr-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                        post.computedStatus === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                                        post.computedStatus === 'yellow' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    }`}>
                                        {getStatusLabel(post.computedStatus || 'green')}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                        <Calendar size={10}/> Prazo: {formattedDeadline}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                        <User size={10}/> {post.responsavel}
                                    </span>
                                </div>
                                
                                <h4 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{post.titulo}</h4>
                                
                                {/* Barra de Progresso por Etapas */}
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                        <div 
                                            className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 min-w-[30px] text-right">{progress.toFixed(0)}%</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">{post.etapas.filter(e => e.concluido).length} de {post.etapas.length} etapas concluídas</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                                <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors"/>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        ))}
        {filteredPosts.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                <LayoutDashboard className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-sm font-bold uppercase">Nenhuma meta encontrada.</p>
            </div>
        )}
      </div>

      {/* Modal Completo */}
      {selectedPost && (
        <ReportModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

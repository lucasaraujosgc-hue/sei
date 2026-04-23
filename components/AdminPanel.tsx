import React, { useState, useRef } from 'react';
import { X, Plus, Lock, Save, Trash2, Calendar, LayoutList, AlertTriangle, User, FileText, CheckSquare, Square, Link as LinkIcon, MessageSquare, ArrowDown } from 'lucide-react';
import { Meta, TopicId, Etapa, HistoricoItem, Vinculo, NotaEtapa } from '../types';
import { TOPICS } from '../constants';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Meta[];
  onAddPost: (meta: Omit<Meta, 'id' | 'createdAt' | 'order'>) => Promise<boolean | void>;
  onEditPost: (id: string, meta: Partial<Meta>) => Promise<boolean | void>;
  onDeletePost: (postId: string) => void;
  usingServer: boolean;
}

const USERS_MAP: Record<string, string> = {
  'azul': 'Lucas Araujo dos Santos',
  'amarelo': 'Gilda Natali Mendes dos Santos Lemos',
  'preto': 'Ana Paula Daltro Oliveira',
  'rosa': 'Maiara dos Santos Maia'
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, onClose, posts, onAddPost, onEditPost, onDeletePost
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [topicId, setTopicId] = useState<TopicId>(TopicId.EDUCACAO);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazoGeral, setPrazoGeral] = useState('');
  const [diasAlerta, setDiasAlerta] = useState(7);
  const [responsavel, setResponsavel] = useState('');
  
  // Etapas State
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [novaObs, setNovaObs] = useState('');
  const [tipoObs, setTipoObs] = useState<'obs' | 'atraso'>('obs');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPass = passwordInput.trim().toLowerCase();
    if (USERS_MAP[normalizedPass]) {
      setIsAuthenticated(true);
      setCurrentUser(USERS_MAP[normalizedPass]);
    } else {
      setLoginError('Senha incorreta.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitulo('');
    setDescricao('');
    setPrazoGeral('');
    setDiasAlerta(7);
    setResponsavel('');
    setEtapas([]);
    setHistorico([]);
    setNovaObs('');
  };

  const handleEditClick = (meta: Meta) => {
    setEditingId(meta.id);
    setTopicId(meta.topicId);
    setTitulo(meta.titulo);
    setDescricao(meta.descricao);
    setPrazoGeral(meta.prazoGeral);
    setDiasAlerta(meta.diasAlerta);
    setResponsavel(meta.responsavel);
    // Garantir que vinculos e notas existam (migração de dados antigos)
    setEtapas(meta.etapas.map(e => ({
        ...e,
        vinculos: e.vinculos || ((e as any).secretariaVinculada ? [{ tipo: 'secretaria', valor: (e as any).secretariaVinculada }] : []),
        notas: e.notas || []
    })) || []);
    setHistorico(meta.historico || []);
    setActiveTab('form');
  };

  // --- LÓGICA DE ETAPAS ---

  const insertEtapa = (index: number) => {
    const novaEtapa: Etapa = {
        id: Date.now().toString(),
        descricao: '',
        prazo: prazoGeral,
        concluido: false,
        vinculos: [],
        notas: []
    };
    const novas = [...etapas];
    novas.splice(index + 1, 0, novaEtapa);
    setEtapas(novas);
  };

  const addEtapa = () => {
      insertEtapa(etapas.length - 1);
  };

  const updateEtapa = (index: number, field: keyof Etapa, value: any) => {
    const novas = [...etapas];
    (novas[index] as any)[field] = value;
    if (field === 'concluido' && value === true && !novas[index].dataConclusao) {
        novas[index].dataConclusao = new Date().toISOString();
    }
    setEtapas(novas);
  };

  const removeEtapa = (index: number) => {
    setEtapas(etapas.filter((_, i) => i !== index));
  };

  // --- LÓGICA DE VÍNCULOS NA ETAPA ---
  
  const addVinculo = (index: number, tipo: 'secretaria' | 'outro', valor: string) => {
      if (!valor) return;
      const novas = [...etapas];
      const vinculoExistente = novas[index].vinculos.find(v => v.tipo === tipo && v.valor === valor);
      if (!vinculoExistente) {
          novas[index].vinculos.push({ tipo, valor });
      }
      setEtapas(novas);
  };

  const removeVinculo = (etapaIndex: number, vinculoIndex: number) => {
      const novas = [...etapas];
      novas[etapaIndex].vinculos = novas[etapaIndex].vinculos.filter((_, i) => i !== vinculoIndex);
      setEtapas(novas);
  };

  // --- LÓGICA DE NOTAS NA ETAPA ---

  const addNota = (index: number, texto: string, cor: 'green' | 'yellow' | 'red') => {
      if (!texto.trim()) return;
      const novas = [...etapas];
      novas[index].notas.push({ id: Date.now().toString(), texto, cor });
      setEtapas(novas);
  };

  const removeNota = (etapaIndex: number, notaIndex: number) => {
      const novas = [...etapas];
      novas[etapaIndex].notas = novas[etapaIndex].notas.filter((_, i) => i !== notaIndex);
      setEtapas(novas);
  };

  // ---------------------------

  const handleSubmit = async () => {
    if (!titulo || !prazoGeral) {
        alert("Título e Prazo Geral são obrigatórios.");
        return;
    }

    let finalHistorico = [...historico];
    if (novaObs.trim()) {
        finalHistorico.push({
            data: Date.now(),
            texto: novaObs,
            tipo: tipoObs,
            autor: currentUser
        });
    }

    const metaData = {
        topicId,
        titulo,
        descricao,
        prazoGeral,
        diasAlerta,
        responsavel,
        etapas,
        historico: finalHistorico,
        dataAtualizacao: Date.now(),
        lastEditor: currentUser
    };

    let success;
    if (editingId) {
        success = await onEditPost(editingId, metaData);
    } else {
        success = await onAddPost(metaData);
    }

    if (success !== false) {
        resetForm();
        setActiveTab('list');
    }
  };

  if (!isAuthenticated) {
    return (
     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
       <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 md:p-12 w-full max-w-sm text-center space-y-8 shadow-2xl">
         <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20"><Lock className="text-emerald-400" size={32}/></div>
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Gestão Técnica</h2>
         <form onSubmit={handleLogin} className="space-y-4">
           <input type="password" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setLoginError(''); }} placeholder="Senha" className={`w-full p-4 bg-slate-950 border ${loginError ? 'border-red-500' : 'border-slate-800'} rounded-2xl text-white text-center font-black outline-none focus:ring-2 focus:ring-emerald-500`} autoFocus />
           {loginError && <p className="text-red-400 text-xs font-bold mt-2">{loginError}</p>}
           <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase hover:bg-emerald-500 transition-all">Acessar</button>
         </form>
       </div>
     </div>
   );
 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] w-full max-w-5xl h-[95vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckSquare className="text-emerald-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Gestão de Metas</h2>
                    <p className="text-xs text-slate-500 font-bold">Usuário: {currentUser}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => { resetForm(); setActiveTab('form'); }} className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${activeTab === 'form' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Nova Meta</button>
                <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${activeTab === 'list' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Lista</button>
                <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-slate-500 transition-all ml-4"><X size={20}/></button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {activeTab === 'list' ? (
                <div className="space-y-4">
                    {posts.map(meta => (
                        <div key={meta.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-all">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${TOPICS.find(t => t.id === meta.topicId)?.color.replace('bg-', 'text-emerald-').replace('500','400').replace('600','400') || 'text-slate-400'} border-slate-700`}>{TOPICS.find(t => t.id === meta.topicId)?.label}</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(meta.prazoGeral).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">{meta.titulo}</h3>
                                <p className="text-xs text-slate-400">{meta.etapas.filter(e => e.concluido).length}/{meta.etapas.length} etapas concluídas</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditClick(meta)} className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all"><LayoutList size={18}/></button>
                                <button onClick={() => onDeletePost(meta.id)} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && <p className="text-center text-slate-500 py-10">Nenhuma meta cadastrada.</p>}
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Bloco 1: Definição Geral */}
                    <section className="space-y-6 bg-slate-900/30 p-6 rounded-3xl border border-slate-800/50">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                            <FileText size={16} className="text-emerald-500"/> Definição da Meta
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Secretaria Responsável</label>
                                <select value={topicId} onChange={e => setTopicId(e.target.value as TopicId)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-medium focus:border-emerald-500 outline-none">
                                    {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Título da Meta</label>
                                <input value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-bold focus:border-emerald-500 outline-none" placeholder="Ex: Construção da Escola X" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Descrição Detalhada</label>
                            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 outline-none" rows={3} />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Responsável Político</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-3.5 text-slate-600"/>
                                    <input value={responsavel} onChange={e => setResponsavel(e.target.value)} className="w-full p-3 pl-9 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 outline-none" placeholder="Nome" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Prazo Final da Meta</label>
                                <input type="date" value={prazoGeral} onChange={e => setPrazoGeral(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-bold focus:border-emerald-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-amber-500 uppercase">Alerta (Dias Antes)</label>
                                <input type="number" value={diasAlerta} onChange={e => setDiasAlerta(Number(e.target.value))} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-bold focus:border-emerald-500 outline-none" />
                            </div>
                        </div>
                    </section>

                    {/* Bloco 2: Etapas */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <LayoutList size={16} className="text-emerald-500"/> Etapas do Processo
                            </h3>
                            <button onClick={addEtapa} className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1">
                                <Plus size={12}/> Adicionar Etapa Final
                            </button>
                        </div>

                        <div className="space-y-4">
                            {etapas.map((etapa, idx) => (
                                <div key={idx} className="relative group/item">
                                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col gap-4">
                                        <div className="flex items-start gap-3">
                                            <button onClick={() => updateEtapa(idx, 'concluido', !etapa.concluido)} className={`shrink-0 transition-colors mt-1 ${etapa.concluido ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}>
                                                {etapa.concluido ? <CheckSquare size={24}/> : <Square size={24}/>}
                                            </button>
                                            
                                            <div className="flex-1 space-y-3">
                                                {/* Linha Principal da Etapa */}
                                                <div className="flex flex-col md:flex-row gap-3">
                                                    <div className="flex-1">
                                                        <span className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Descrição da Etapa #{idx+1}</span>
                                                        <input 
                                                            value={etapa.descricao} 
                                                            onChange={e => updateEtapa(idx, 'descricao', e.target.value)} 
                                                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-emerald-500 outline-none"
                                                            placeholder="O que deve ser feito?"
                                                        />
                                                    </div>
                                                    <div className="w-full md:w-40">
                                                        <span className="text-[9px] font-black text-slate-500 uppercase mb-1 block">Prazo da Etapa</span>
                                                        <input 
                                                            type="date"
                                                            value={etapa.prazo} 
                                                            onChange={e => updateEtapa(idx, 'prazo', e.target.value)} 
                                                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 focus:border-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Ferramentas da Etapa (Vínculos e Notas) */}
                                                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800/50">
                                                    
                                                    {/* Vínculos */}
                                                    <div className="flex-1 min-w-[200px]">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <LinkIcon size={12} className="text-slate-500"/>
                                                            <span className="text-[10px] font-black text-slate-500 uppercase">Vincular a Outra Secretaria</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <select 
                                                                className="bg-slate-950 border border-slate-800 text-[10px] text-white rounded-lg p-1.5 outline-none"
                                                                onChange={(e) => {
                                                                    if(e.target.value) addVinculo(idx, 'secretaria', e.target.value);
                                                                    e.target.value = '';
                                                                }}
                                                            >
                                                                <option value="">+ Secretaria</option>
                                                                {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                                            </select>
                                                            
                                                            {/* Input para "Outro" */}
                                                            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                                                                <input 
                                                                    className="bg-transparent text-[10px] text-white w-20 px-1 outline-none" 
                                                                    placeholder="+ Outro"
                                                                    onKeyDown={(e) => {
                                                                        if(e.key === 'Enter') {
                                                                            addVinculo(idx, 'outro', e.currentTarget.value);
                                                                            e.currentTarget.value = '';
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            {etapa.vinculos?.map((v, vIdx) => (
                                                                <span key={vIdx} className="text-[9px] font-bold uppercase flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                                                                    {v.tipo === 'secretaria' ? TOPICS.find(t => t.id === v.valor)?.label : v.valor}
                                                                    <button onClick={() => removeVinculo(idx, vIdx)} className="hover:text-red-400"><X size={10}/></button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Notas/Observações Coloridas */}
                                                    <div className="flex-1 min-w-[200px]">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MessageSquare size={12} className="text-slate-500"/>
                                                            <span className="text-[10px] font-black text-slate-500 uppercase">Observações da Etapa</span>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex gap-1">
                                                                <input 
                                                                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white w-full outline-none" 
                                                                    placeholder="Nova observação..." 
                                                                    id={`input-obs-${idx}`}
                                                                />
                                                                <button onClick={() => { const el = document.getElementById(`input-obs-${idx}`) as HTMLInputElement; addNota(idx, el.value, 'green'); el.value=''; }} className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"><div className="w-2 h-2 rounded-full bg-current"></div></button>
                                                                <button onClick={() => { const el = document.getElementById(`input-obs-${idx}`) as HTMLInputElement; addNota(idx, el.value, 'yellow'); el.value=''; }} className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors"><div className="w-2 h-2 rounded-full bg-current"></div></button>
                                                                <button onClick={() => { const el = document.getElementById(`input-obs-${idx}`) as HTMLInputElement; addNota(idx, el.value, 'red'); el.value=''; }} className="w-6 h-6 rounded bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"><div className="w-2 h-2 rounded-full bg-current"></div></button>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                {etapa.notas?.map((nota, nIdx) => (
                                                                    <div key={nIdx} className={`text-[9px] px-2 py-1 rounded border flex justify-between items-center ${nota.cor === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-300' : nota.cor === 'yellow' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
                                                                        <span>{nota.texto}</span>
                                                                        <button onClick={() => removeNota(idx, nIdx)}><X size={10}/></button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <button onClick={() => removeEtapa(idx)} className="p-2 text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                    
                                    {/* Botão de Inserção Entre Etapas */}
                                    <div className="h-4 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <div className="h-px bg-slate-800 w-full"></div>
                                        <button onClick={() => insertEtapa(idx)} className="absolute bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full transition-colors flex items-center gap-1">
                                            <ArrowDown size={10}/> Inserir Etapa Abaixo
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {etapas.length === 0 && <div className="text-center text-slate-600 text-xs italic py-4 border border-dashed border-slate-800 rounded-xl">Nenhuma etapa definida.</div>}
                        </div>
                    </section>

                    {/* Bloco 3: Observações / Histórico Geral */}
                    <section className="space-y-4 pt-4 border-t border-slate-800">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Adicionar Observação / Justificativa (Geral)</h3>
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="tipoObs" checked={tipoObs === 'obs'} onChange={() => setTipoObs('obs')} className="accent-emerald-500"/>
                                    <span className="text-xs text-slate-300">Nota Geral</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="tipoObs" checked={tipoObs === 'atraso'} onChange={() => setTipoObs('atraso')} className="accent-red-500"/>
                                    <span className="text-xs text-slate-300">Reportar Atraso</span>
                                </label>
                            </div>
                            <textarea 
                                value={novaObs}
                                onChange={e => setNovaObs(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none"
                                placeholder="Digite aqui..."
                                rows={2}
                            />
                        </div>
                    </section>

                    <div className="pt-6">
                        <button onClick={handleSubmit} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                            <Save size={20}/> Salvar Meta
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
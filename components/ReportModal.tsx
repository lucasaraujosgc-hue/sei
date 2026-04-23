import React from 'react';
import { X, Target, Calendar, User, CheckCircle2, Circle, Link as LinkIcon, MessageSquare, AlertTriangle, Clock, ListChecks } from 'lucide-react';
import { Meta } from '../types';
import { TOPICS } from '../constants';

export const ReportModal = ({ post, onClose }: { post: Meta, onClose: () => void }) => {
  // Lógica de cores do status
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'red': return 'text-red-400 bg-red-500/10 border-red-500/20';
          case 'yellow': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
          default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      }
  };

  const getStatusText = (status: string) => {
      switch(status) {
          case 'red': return 'Fora do Prazo';
          case 'yellow': return 'Atenção ao Prazo';
          default: return 'Dentro do Prazo';
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl overflow-y-auto" onClick={onClose}>
      <div className="bg-[#0b1120] w-full max-w-4xl rounded-[2.5rem] border border-slate-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-10 duration-500 overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/40 flex justify-between items-start shrink-0">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(post.computedStatus || 'green')}`}>
                    {getStatusText(post.computedStatus || 'green')}
                </span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Target size={12}/> {TOPICS.find(t => t.id === post.topicId)?.label}
                </span>
                {post.isExternal && (
                    <span className="text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1">
                        <LinkIcon size={10}/> Vinculada
                    </span>
                )}
             </div>
             <h2 className="text-3xl font-black text-white leading-tight">{post.titulo}</h2>
             <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-500"/> Prazo: {new Date(post.prazoGeral).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><User size={14} className="text-slate-500"/> Resp: {post.responsavel}</span>
             </div>
          </div>
          <button onClick={onClose} className="p-4 bg-slate-800/50 hover:bg-red-500 text-slate-400 hover:text-white rounded-2xl transition-all shadow-xl"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
          
          {/* Descrição */}
          <section className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800/50">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Descrição da Meta</h3>
             <p className="text-slate-300 leading-relaxed text-sm">{post.descricao}</p>
          </section>

          {/* Etapas */}
          <section>
             <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <ListChecks size={18} className="text-emerald-500"/> Etapas ({post.computedProgress?.toFixed(0)}%)
                </h3>
             </div>
             
             <div className="space-y-3">
                {post.etapas.map((etapa, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${etapa.concluido ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-slate-900/40 border-slate-800'}`}>
                        <div className="flex gap-4">
                            <div className={`mt-1 ${etapa.concluido ? 'text-emerald-500' : 'text-slate-600'}`}>
                                {etapa.concluido ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold ${etapa.concluido ? 'text-emerald-100 line-through opacity-70' : 'text-slate-200'}`}>{etapa.descricao}</h4>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${etapa.concluido ? 'text-emerald-500/50' : 'text-slate-500'}`}>
                                        <Clock size={10}/> {new Date(etapa.prazo).toLocaleDateString()}
                                    </span>
                                    
                                    {/* Exibição dos Vínculos */}
                                    {etapa.vinculos?.map((v, vIdx) => (
                                        <span key={vIdx} className="text-[9px] font-bold uppercase flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                            <LinkIcon size={10}/> {v.tipo === 'secretaria' ? TOPICS.find(t => t.id === v.valor)?.label : v.valor}
                                        </span>
                                    ))}
                                    
                                    {/* Fallback para legado */}
                                    {(etapa as any).secretariaVinculada && !etapa.vinculos && (
                                        <span className="text-[9px] font-bold uppercase flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                            <LinkIcon size={10}/> {TOPICS.find(t => t.id === (etapa as any).secretariaVinculada)?.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notas da Etapa */}
                        {etapa.notas && etapa.notas.length > 0 && (
                            <div className="ml-10 space-y-1">
                                {etapa.notas.map((nota, nIdx) => (
                                    <div key={nIdx} className={`text-[11px] px-3 py-1.5 rounded-lg border inline-block mr-2 mb-1 ${
                                        nota.cor === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 
                                        nota.cor === 'yellow' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 
                                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                    }`}>
                                        {nota.texto}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {post.etapas.length === 0 && <p className="text-slate-500 italic text-sm">Nenhuma etapa cadastrada.</p>}
             </div>
          </section>

          {/* Histórico / Observações Gerais */}
          <section>
             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <MessageSquare size={18} className="text-purple-500"/> Histórico e Observações Gerais
             </h3>
             <div className="space-y-4">
                {post.historico && post.historico.length > 0 ? [...post.historico].reverse().map((hist, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full ${hist.tipo === 'atraso' ? 'bg-red-500' : hist.tipo === 'conclusao' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                            <div className="w-px h-full bg-slate-800 my-1"></div>
                        </div>
                        <div className="pb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-slate-500 uppercase">{new Date(hist.data).toLocaleDateString()}</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">• {hist.autor}</span>
                                {hist.tipo === 'atraso' && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 rounded uppercase font-black">Atraso</span>}
                            </div>
                            <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 inline-block">
                                {hist.texto}
                            </p>
                        </div>
                    </div>
                )) : <p className="text-slate-500 italic text-sm">Nenhuma observação registrada.</p>}
             </div>
          </section>

        </div>
        
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
           <span>Atualizado em: {new Date(post.dataAtualizacao).toLocaleDateString()}</span>
           <div className="flex gap-4">
                {post.lastEditor && <span className="text-emerald-400">{post.lastEditor}</span>}
           </div>
        </div>
      </div>
    </div>
  );
};
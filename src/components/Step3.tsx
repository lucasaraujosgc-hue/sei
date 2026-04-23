import React, { useState } from 'react';
import { ProcessoData, DocumentoData } from '../types';
import { Plus, Trash2, FileText, Stamp } from 'lucide-react';

interface Props {
  data: ProcessoData;
  update: (updates: Partial<ProcessoData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3({ data, update, onNext, onPrev }: Props) {
  
  const [addingDocFor, setAddingDocFor] = useState<string | null>(null);
  const [newDoc, setNewDoc] = useState<Partial<DocumentoData>>({
    nome: '',
    internoExterno: '',
    precisaAssinatura: '',
    formato: 'SEI / PDF',
    jaExisteNoSEI: '',
    criadoBaseadoEmModelo: '',
    observacao: ''
  });

  const saveDoc = (tramitacaoId: string) => {
    if (!newDoc.nome || !newDoc.internoExterno || !newDoc.precisaAssinatura) return;

    const docReady: DocumentoData = {
      id: Date.now().toString(),
      nome: newDoc.nome || '',
      internoExterno: newDoc.internoExterno as 'Interno' | 'Externo',
      precisaAssinatura: newDoc.precisaAssinatura as 'Sim' | 'Não',
      formato: newDoc.formato || 'SEI / PDF',
      jaExisteNoSEI: newDoc.jaExisteNoSEI as any,
      criadoBaseadoEmModelo: newDoc.criadoBaseadoEmModelo as any,
      observacao: newDoc.observacao || ''
    };

    const updatedTramitacoes = data.tramitacoes.map(t => {
      if (t.id === tramitacaoId) {
        return { ...t, documentos: [...t.documentos, docReady] };
      }
      return t;
    });

    update({ tramitacoes: updatedTramitacoes });
    
    // reset form
    setNewDoc({
      nome: '',
      internoExterno: '',
      precisaAssinatura: '',
      formato: 'SEI / PDF',
      jaExisteNoSEI: '',
      criadoBaseadoEmModelo: '',
      observacao: ''
    });
    setAddingDocFor(null);
  };

  const removeDoc = (tramitacaoId: string, docId: string) => {
    const updatedTramitacoes = data.tramitacoes.map(t => {
      if (t.id === tramitacaoId) {
        return { ...t, documentos: t.documentos.filter(d => d.id !== docId) };
      }
      return t;
    });
    update({ tramitacoes: updatedTramitacoes });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Etapa 3: Documentação</h2>
        <p className="text-slate-400 mt-1">Associe os documentos necessários para cada unidade na linha do tempo.</p>
        <div className="mt-4 bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 text-sm text-blue-200">
          <p><strong>Interno:</strong> Documentos criados no editor de texto do SEI.</p>
          <p><strong>Externo:</strong> Documentos inseridos no SEI por upload (PDF, etc).</p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {data.tramitacoes.map((t, idx) => (
          <div key={t.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-blue-400">Passo {idx + 1}</span>
                <h3 className="font-medium text-white">{t.unidadeDescricao}</h3>
              </div>
              <button 
                onClick={() => setAddingDocFor(t.id)}
                className="text-xs flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors"
              >
                <Plus size={14} /> Adicionar Documento
              </button>
            </div>

            {/* Document List */}
            <div className="p-4 bg-slate-950/50">
              {t.documentos.length === 0 && addingDocFor !== t.id && (
                <p className="text-sm text-slate-500 italic text-center py-2">Nenhum documento cadastrado nesta unidade.</p>
              )}
              
              <div className="space-y-2">
                {t.documentos.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-md ${doc.internoExterno === 'Interno' ? 'bg-blue-900/30 text-blue-400' : 'bg-orange-900/30 text-orange-400'}`}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{doc.nome}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>{doc.internoExterno}</span>
                          {doc.precisaAssinatura === 'Sim' && (
                            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-900/20 px-1.5 rounded"><Stamp size={12} /> Exige Assinatura</span>
                          )}
                          {doc.observacao && <span>• Obs: {doc.observacao}</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeDoc(t.id, doc.id)} className="text-slate-500 hover:text-red-400 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add document form */}
              {addingDocFor === t.id && (
                <div className="mt-4 bg-slate-900 border border-slate-700 p-4 rounded-lg space-y-4">
                  <h4 className="text-sm font-medium text-white border-b border-slate-800 pb-2">Novo Documento</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Documento <span className="text-red-400">*</span></label>
                      <input 
                        type="text" 
                        value={newDoc.nome} 
                        onChange={e => setNewDoc({...newDoc, nome: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-sm px-3 py-2 text-white"
                        placeholder="Ex: Comunicação Interna - CI"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Origem <span className="text-red-400">*</span></label>
                      <select 
                        value={newDoc.internoExterno}
                        onChange={e => setNewDoc({...newDoc, internoExterno: e.target.value as any})}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-sm px-3 py-2 text-white"
                      >
                        <option value="">-- Selecionar --</option>
                        <option value="Interno">Interno (Criado no SEI)</option>
                        <option value="Externo">Externo (Upload PDF)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Necessita Assinatura? <span className="text-red-400">*</span></label>
                      <select 
                        value={newDoc.precisaAssinatura}
                        onChange={e => setNewDoc({...newDoc, precisaAssinatura: e.target.value as any})}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-sm px-3 py-2 text-white"
                      >
                        <option value="">-- Selecionar --</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Observações (Opcional)</label>
                      <input 
                        type="text" 
                        value={newDoc.observacao} 
                        onChange={e => setNewDoc({...newDoc, observacao: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-sm px-3 py-2 text-white"
                        placeholder="Ex: Caso extraído de sistema x..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button onClick={() => setAddingDocFor(null)} className="text-xs px-3 py-1.5 rounded text-slate-300 hover:bg-slate-800">Cancelar</button>
                    <button 
                      onClick={() => saveDoc(t.id)} 
                      disabled={!newDoc.nome || !newDoc.internoExterno || !newDoc.precisaAssinatura}
                      className="text-xs px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                    >
                      Salvar Documento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-800">
        <button 
          onClick={onPrev} 
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-slate-700"
        >
          Voltar
        </button>
        <button 
          onClick={onNext} 
          // allow to advance even if empty (some process actions might just be forwarding)
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}

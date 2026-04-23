import React, { useState } from 'react';
import { ProcessoData, TramitacaoData } from '../types';
import { ORGAOS } from '../data/orgaos';
import { Plus, Trash2, ArrowDown } from 'lucide-react';

interface Props {
  data: ProcessoData;
  update: (updates: Partial<ProcessoData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2({ data, update, onNext, onPrev }: Props) {
  const [selectedSec, setSelectedSec] = useState('');
  const [selectedDiv, setSelectedDiv] = useState('');

  const availableDivisions = ORGAOS.find(o => o.nome === selectedSec)?.unidades || [];

  const handleAddTramitacao = () => {
    if (!selectedSec || !selectedDiv) return;
    
    const sec = ORGAOS.find(o => o.nome === selectedSec);
    const div = sec?.unidades.find(u => u.sigla === selectedDiv);
    
    if (sec && div) {
      const newTramitacao: TramitacaoData = {
        id: Date.now().toString(),
        secretariaNome: sec.nome,
        unidadeSigla: div.sigla,
        unidadeDescricao: div.descricao,
        documentos: []
      };
      
      update({ tramitacoes: [...data.tramitacoes, newTramitacao] });
      setSelectedSec('');
      setSelectedDiv('');
    }
  };

  const removeTramitacao = (id: string) => {
    update({ tramitacoes: data.tramitacoes.filter(t => t.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Etapa 2: Linha do Tempo (Tramitação)</h2>
        <p className="text-slate-400 mt-1">Defina por onde o processo tramita, em ordem.</p>
      </div>

      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Adicionar Unidade na Tramitação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Passo A: Secretaria / Órgão</label>
            <select 
              value={selectedSec}
              onChange={(e) => { setSelectedSec(e.target.value); setSelectedDiv(''); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Selecione a Secretaria --</option>
              {ORGAOS.map(o => (
                <option key={o.nome} value={o.nome}>{o.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Passo B: Unidade / Divisão</label>
            <select 
              value={selectedDiv}
              onChange={(e) => setSelectedDiv(e.target.value)}
              disabled={!selectedSec}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">-- Selecione a Unidade --</option>
              {availableDivisions.map(u => (
                <option key={u.sigla} value={u.sigla}>{u.descricao} ({u.sigla})</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleAddTramitacao}
          disabled={!selectedSec || !selectedDiv}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-slate-700"
        >
          <Plus size={16} /> Adicionar na Linha do Tempo
        </button>
      </div>

      {data.tramitacoes.length > 0 && (
        <div className="mt-8 space-y-0">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Fluxo do Processo</h3>
          {data.tramitacoes.map((t, idx) => (
            <div key={t.id} className="flex flex-col relative w-full items-center">
               <div className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-lg">
                 <div>
                   <p className="text-xs font-bold text-blue-400 mb-1">Passo {idx + 1}</p>
                   <p className="font-medium text-white">{t.unidadeDescricao}</p>
                   <p className="text-xs text-slate-400">{t.secretariaNome} • {t.unidadeSigla}</p>
                 </div>
                 <button onClick={() => removeTramitacao(t.id)} className="text-slate-500 hover:text-red-400 transition-colors p-2">
                   <Trash2 size={18} />
                 </button>
               </div>
               
               {idx < data.tramitacoes.length - 1 && (
                 <div className="h-6 w-px bg-slate-700 flex items-center justify-center my-1">
                   <ArrowDown size={14} className="text-slate-500 bg-[#020617]" />
                 </div>
               )}
            </div>
          ))}
        </div>
      )}

      {data.tramitacoes.length === 0 && (
        <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-lg">
          Nenhuma unidade adicionada. Adicione as unidades para formar o fluxo.
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-slate-800">
        <button 
          onClick={onPrev} 
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-slate-700"
        >
          Voltar
        </button>
        <button 
          onClick={onNext} 
          disabled={data.tramitacoes.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}

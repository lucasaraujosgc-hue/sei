import React, { useState } from 'react';
import { ProcessoData } from '../types';
import { ORGAOS } from '../data/orgaos';
import { Search } from 'lucide-react';

interface Props {
  data: ProcessoData;
  update: (updates: Partial<ProcessoData>) => void;
  onNext: () => void;
}

export default function Step1({ data, update, onNext }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all units for the Initiator dropdown
  const allUnits = ORGAOS.flatMap(sec => sec.unidades);

  const filteredUnits = allUnits.filter(u => 
    u.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUnidade = (unidadeDescricao: string) => {
    if (data.unidadesIniciadoras.includes(unidadeDescricao)) {
      update({ unidadesIniciadoras: data.unidadesIniciadoras.filter(u => u !== unidadeDescricao) });
    } else {
      update({ unidadesIniciadoras: [...data.unidadesIniciadoras, unidadeDescricao] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Etapa 1: Base de Conhecimento</h2>
        <p className="text-slate-400 mt-1">Preencha os dados básicos do processo administrativo.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">1. Nome do processo <span className="text-red-400">*</span></label>
          <input 
            type="text" 
            value={data.nome}
            onChange={(e) => update({ nome: e.target.value })}
            placeholder="Ex: Férias do Servidor"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">Dica: Inserir a nomenclatura do processo (padronização definida pela Gestão Documental).</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">2. Finalidade do processo <span className="text-red-400">*</span></label>
          <textarea 
            value={data.finalidade}
            onChange={(e) => update({ finalidade: e.target.value })}
            placeholder="Ex: Programar e conceder o direito a férias remuneradas..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">Dica: Informar a finalidade ou objetivo principal do processo.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">3. Base Legal <span className="text-red-400">*</span></label>
          <input 
            type="text" 
            value={data.baseLegal}
            onChange={(e) => update({ baseLegal: e.target.value })}
            placeholder="Ex: Lei nº 6.677, de 26/09/1994"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">Dica: Informar as normas e leis que fundamentam o processo.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">4. Unidade(s) que inicia(m) o processo (Quem faz) <span className="text-red-400">*</span></label>
          
          <div className="border border-slate-700 bg-slate-950 rounded-lg flex flex-col mb-2 h-64">
            <div className="p-3 border-b border-slate-800 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar unidade por nome ou sigla..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-1">
              {filteredUnits.length > 0 ? filteredUnits.map(u => {
                const isChecked = data.unidadesIniciadoras.includes(u.descricao);
                return (
                  <label key={u.sigla} className="flex items-center gap-3 text-sm text-slate-300 hover:bg-slate-800 p-2 rounded cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => toggleUnidade(u.descricao)}
                      className="accent-blue-500 w-4 h-4 rounded border-slate-600"
                    />
                    <span>{u.descricao} <span className="text-slate-500 ml-1">({u.sigla})</span></span>
                  </label>
                );
              }) : (
                <p className="text-slate-500 text-xs text-center py-4">Nenhuma unidade encontrada.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {data.unidadesIniciadoras.map((u, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-sm text-slate-300">
                <span>{u}</span>
                <button onClick={() => toggleUnidade(u)} className="text-slate-400 hover:text-red-400 transition-colors">&times;</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Dica: Apresentar qual órgão/unidade é responsável por iniciar o processo. Selecione quantos precisar.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">5. O processo possui fluxo mapeado? <span className="text-red-400">*</span></label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="radio" checked={data.possuiFluxoMapeado === 'Sim'} onChange={() => update({ possuiFluxoMapeado: 'Sim' })} className="accent-blue-500" /> Sim
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="radio" checked={data.possuiFluxoMapeado === 'Não'} onChange={() => update({ possuiFluxoMapeado: 'Não' })} className="accent-blue-500" /> Não
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-800 mt-8">
        <button 
          onClick={onNext} 
          disabled={!data.nome || !data.finalidade || !data.baseLegal || data.unidadesIniciadoras.length === 0 || !data.possuiFluxoMapeado}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}

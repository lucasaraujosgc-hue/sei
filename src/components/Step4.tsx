import React from 'react';
import { ProcessoData } from '../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  data: ProcessoData;
  update: (updates: Partial<ProcessoData>) => void;
  onFinish: () => void;
  onPrev: () => void;
}

export default function Step4({ data, update, onFinish, onPrev }: Props) {
  
  const setNivel = (nivel: ProcessoData['nivelAcesso']) => {
    update({ nivelAcesso: nivel, hipoteseLegal: nivel === 'Público' ? '' : data.hipoteseLegal });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Etapa 4: Nível de Acesso</h2>
        <p className="text-slate-400 mt-1">Defina o nível de transparência e acesso ao processo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div 
          onClick={() => setNivel('Público')}
          className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${data.nivelAcesso === 'Público' ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
        >
          <h3 className={`font-bold mb-2 ${data.nivelAcesso === 'Público' ? 'text-emerald-400' : 'text-slate-200'}`}>Público</h3>
          <p className="text-sm text-slate-400">Todos podem ver o processo e ler os documentos.</p>
        </div>
        
        <div 
          onClick={() => setNivel('Restrito')}
          className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${data.nivelAcesso === 'Restrito' ? 'border-orange-500 bg-orange-900/20' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
        >
          <h3 className={`font-bold mb-2 ${data.nivelAcesso === 'Restrito' ? 'text-orange-400' : 'text-slate-200'}`}>Restrito</h3>
          <p className="text-sm text-slate-400">Só as unidades por onde tramita o processo podem ler os documentos. Todos podem ver o processo.</p>
        </div>

        <div 
          onClick={() => setNivel('Sigiloso')}
          className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${data.nivelAcesso === 'Sigiloso' ? 'border-red-500 bg-red-900/20' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
        >
          <h3 className={`font-bold mb-2 ${data.nivelAcesso === 'Sigiloso' ? 'text-red-400' : 'text-slate-200'}`}>Sigiloso</h3>
          <p className="text-sm text-slate-400">Só usuários credenciados poderão ver o processo e ler os documentos.</p>
        </div>
      </div>

      {(data.nivelAcesso === 'Restrito' || data.nivelAcesso === 'Sigiloso') && (
        <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mt-6 rounded-r-lg">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-500 shrink-0" />
            <div className="w-full">
              <h4 className="text-yellow-500 font-bold uppercase text-sm mb-2">Atenção: Obrigatório apresentar hipótese legal</h4>
              <textarea 
                value={data.hipoteseLegal}
                onChange={e => update({ hipoteseLegal: e.target.value })}
                placeholder="Indique a lei ou decreto que justifica a restrição/sigilo..."
                className="w-full bg-slate-950 border border-yellow-900 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 text-sm"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {data.nivelAcesso === 'Público' && (
        <div className="bg-emerald-900/20 border border-emerald-900/50 p-4 mt-6 rounded-lg text-center flex flex-col items-center">
            <CheckCircle className="text-emerald-500 mb-2" size={32} />
            <p className="text-emerald-200 text-sm font-medium">Nenhuma justificativa legal adicional é necessária para processos públicos.</p>
        </div>
      )}

      <div className="flex justify-between pt-8 border-t border-slate-800">
        <button 
          onClick={onPrev} 
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-slate-700"
        >
          Voltar
        </button>
        <button 
          onClick={onFinish} 
          disabled={!data.nivelAcesso || (data.nivelAcesso !== 'Público' && !data.hipoteseLegal)}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Exportar Planilha (XLSX)
        </button>
      </div>
    </div>
  );
}

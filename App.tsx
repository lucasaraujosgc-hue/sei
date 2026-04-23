import React, { useState } from 'react';
import { ProcessoData } from './types';
import Step1 from './src/components/Step1';
import Step2 from './src/components/Step2';
import Step3 from './src/components/Step3';
import Step4 from './src/components/Step4';
import { generateExcel } from './src/utils/exportExcel';
import { FileSpreadsheet, Save, BookOpen, Clock, FileText, Shield, FolderOpen, Edit2, Trash2, X } from 'lucide-react';

const initialData: ProcessoData = {
  nome: '',
  finalidade: '',
  baseLegal: '',
  unidadesIniciadoras: [],
  possuiFluxoMapeado: '',
  nivelAcesso: 'Público',
  hipoteseLegal: '',
  tramitacoes: []
};

export default function App() {
  const [data, setData] = useState<ProcessoData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);

  const [savedDrafts, setSavedDrafts] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sei_drafts') || '[]');
    } catch {
      return [];
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sei2025' || password === 'SEI2025' || password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleUpdate = (updates: Partial<ProcessoData>) => {
    setData({ ...data, ...updates });
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!data.nome) {
        alert("Por favor, preencha o Nome do Processo na Etapa 1 antes de salvar.");
        return;
    }

    let currentId = data.id || Date.now().toString();
    const currentData = { ...data, id: currentId };
    
    setData(currentData);
    
    let newDrafts = [...savedDrafts];
    const existingIndex = newDrafts.findIndex(d => d.id === currentId);
    
    if (existingIndex >= 0) {
       newDrafts[existingIndex] = { id: currentId, data: currentData, name: currentData.nome || 'Processo Sem Nome' };
    } else {
       newDrafts.push({ id: currentId, data: currentData, name: currentData.nome || 'Processo Sem Nome' });
    }
    
    setSavedDrafts(newDrafts);
    localStorage.setItem('sei_drafts', JSON.stringify(newDrafts));
    setIsSaved(true);
    
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    toast.innerHTML = 'Processo salvo com sucesso!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleExport = (processToExport = data) => {
    generateExcel(processToExport);
  };

  const loadSavedProcess = (processData: ProcessoData) => {
      setData(processData);
      setIsSaved(true);
      setShowSavedList(false);
      setCurrentStep(1); 
  };

  const deleteSavedProcess = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm('Deseja realmente excluir este processo salvo?')) {
          const newDrafts = savedDrafts.filter(d => d.id !== id);
          setSavedDrafts(newDrafts);
          localStorage.setItem('sei_drafts', JSON.stringify(newDrafts));
          if (data.id === id) {
              setData(initialData);
              setIsSaved(false);
              setCurrentStep(1);
          }
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-sm w-full shadow-2xl">
          <div className="flex justify-center mb-6">
             <img src="https://pmsgc-goncalinho.wvai75.easypanel.host/brasao.png" className="h-16 w-auto" alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Mapeamento SEI</h1>
          <p className="text-slate-400 text-sm text-center mb-6">Insira a senha de acesso ao sistema (ex: sei2025)</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Senha de acesso"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Cabeçalho', icon: BookOpen },
    { num: 2, title: 'Linha do Tempo', icon: Clock },
    { num: 3, title: 'Documentação', icon: FileText },
    { num: 4, title: 'Nível de Acesso', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans relative">
      <header className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://pmsgc-goncalinho.wvai75.easypanel.host/brasao.png" className="h-10 w-auto" alt="Logo" />
            <div>
              <h1 className="text-xl font-bold text-white leading-none">Mapeamento SEI</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Prefeitura Municipal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSavedList(true)} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-all active:scale-95 hover:bg-slate-800"
              >
                  <FolderOpen size={16} /> Processos Criados
              </button>
              <button 
                onClick={handleSave} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-all active:scale-95 hover:bg-slate-800"
              >
                  <Save size={16} /> Salvar Rascunho
              </button>
              <button 
                  onClick={() => handleExport(data)} 
                  disabled={!isSaved}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500 rounded-lg transition-all active:scale-95"
              >
                  <FileSpreadsheet size={16} /> Exportar XLSX
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
           <div className="absolute left-0 top-1/2 -z-10 h-1 w-full bg-slate-800 -translate-y-1/2"></div>
           <div className="absolute left-0 top-1/2 -z-10 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-300" style={{ width: `${((currentStep - 1) / 3) * 100}%`}}></div>
           
           {steps.map(step => (
             <div key={step.num} className="flex flex-col items-center">
               <button 
                 onClick={() => setCurrentStep(step.num)}
                 className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${
                   currentStep === step.num 
                    ? 'bg-blue-600 border-[#020617] text-white' 
                    : currentStep > step.num 
                      ? 'bg-blue-600 border-[#020617] text-white' 
                      : 'bg-slate-800 border-[#020617] text-slate-400'
                 }`}
               >
                 <step.icon size={20} />
               </button>
               <span className={`text-xs mt-2 font-medium ${currentStep >= step.num ? 'text-blue-400' : 'text-slate-500'}`}>{step.title}</span>
             </div>
           ))}
        </div>

        {/* Form Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
          {currentStep === 1 && <Step1 data={data} update={handleUpdate} onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && <Step2 data={data} update={handleUpdate} onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />}
          {currentStep === 3 && <Step3 data={data} update={handleUpdate} onNext={() => setCurrentStep(4)} onPrev={() => setCurrentStep(2)} />}
          {currentStep === 4 && <Step4 data={data} isSaved={isSaved} update={handleUpdate} onSave={handleSave} onFinish={() => handleExport(data)} onPrev={() => setCurrentStep(3)} />}
        </div>
      </main>

      {/* Modal de Processos Criados */}
      {showSavedList && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center py-10 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
               <h2 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="text-blue-500" /> Processos Criados</h2>
               <button onClick={() => setShowSavedList(false)} className="text-slate-400 hover:text-white p-2">
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
               {savedDrafts.length === 0 ? (
                  <div className="text-center py-12">
                     <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                     <p className="text-slate-400">Nenhum processo foi salvo ainda.</p>
                  </div>
               ) : (
                  <div className="space-y-3">
                     {savedDrafts.map((d) => (
                        <div key={d.id} onClick={() => loadSavedProcess(d.data)} className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors">
                           <div>
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{d.name}</h3>
                              <p className="text-xs text-slate-400 mt-1">{d.data.tramitacoes?.length || 0} Tramitações • Nível: {d.data.nivelAcesso}</p>
                           </div>
                           <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100">
                              <button 
                                onClick={(e) => { e.stopPropagation(); loadSavedProcess(d.data); }} 
                                className="p-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                title="Editar Processo"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleExport(d.data); }} 
                                className="p-2 border border-green-500/30 text-green-400 hover:bg-green-500/20 rounded transition-colors"
                                title="Exportar XLSX"
                              >
                                <FileSpreadsheet size={16} />
                              </button>
                              <button 
                                onClick={(e) => deleteSavedProcess(d.id, e)} 
                                className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded transition-colors ml-2"
                                title="Excluir Processo"
                              >
                                <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
               <button onClick={() => {
                   setData(initialData); 
                   setIsSaved(false); 
                   setCurrentStep(1); 
                   setShowSavedList(false);
                 }} 
                 className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-slate-700 mr-4"
               >
                 + Criar Novo Processo
               </button>
               <button onClick={() => setShowSavedList(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                 Fechar
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

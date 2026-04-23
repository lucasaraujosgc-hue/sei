import React, { useState } from 'react';
import { ProcessoData } from './types';
import Step1 from './src/components/Step1';
import Step2 from './src/components/Step2';
import Step3 from './src/components/Step3';
import Step4 from './src/components/Step4';
import { generateExcel } from './src/utils/exportExcel';
import { FileSpreadsheet, Download, Save, Home, BookOpen, Clock, FileText, Shield } from 'lucide-react';

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

  const [savedDrafts, setSavedDrafts] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sei_drafts') || '[]');
    } catch {
      return [];
    }
  });

  // A simple password auth requested by user. "quem tiver a senha, funcionará dessa forma"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sei2025' || password === 'SEI2025' || password === 'admin') { // arbitrary simple password
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleUpdate = (updates: Partial<ProcessoData>) => {
    setData({ ...data, ...updates });
  };

  const handleExport = () => {
    generateExcel(data);
  };

  const handleSaveDraft = () => {
    const drafts = [...savedDrafts, { id: Date.now(), data, name: data.nome || 'Rascunho Sem Nome' }];
    setSavedDrafts(drafts);
    localStorage.setItem('sei_drafts', JSON.stringify(drafts));
    alert('Rascunho salvo com sucesso nas estatísticas locais.');
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
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
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
              <button onClick={handleSaveDraft} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-all active:scale-95 hover:bg-slate-800">
                  <Save size={16} /> Salvar Rascunho
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 border border-green-500 rounded-lg transition-all active:scale-95">
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
          {currentStep === 4 && <Step4 data={data} update={handleUpdate} onFinish={handleExport} onPrev={() => setCurrentStep(3)} />}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Shield, Zap, Eye, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Visão Geral',
      balance: 'R$ 2.847,50',
      cards: [
        { label: 'Receitas', value: 'R$ 5.200', color: 'blue' },
        { label: 'Gastos', value: 'R$ 1.852', color: 'red' },
        { label: 'Investido', value: 'R$ 500', color: 'green' }
      ]
    },
    {
      title: 'Cartões de Crédito',
      balance: 'R$ 1.234,00',
      cards: [
        { label: 'Nubank', value: 'R$ 850', color: 'purple' },
        { label: 'Inter', value: 'R$ 284', color: 'orange' },
        { label: 'Limite Total', value: 'R$ 8.000', color: 'gray' }
      ]
    },
    {
      title: 'Metas e Objetivos',
      balance: '3 metas ativas',
      cards: [
        { label: 'Viagem', value: '65%', color: 'blue' },
        { label: 'Emergência', value: '42%', color: 'green' },
        { label: 'Carro', value: '28%', color: 'yellow' }
      ]
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/70 backdrop-blur-md border-b border-gray-100/50' 
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Clarity Cash</span>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-all duration-300"
            >
              Começar gratuitamente
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-4 leading-tight">
              Tenha clareza total
            </h1>
            <h1 className="text-5xl lg:text-6xl font-light text-blue-600 mb-12 leading-tight">
              sobre seu dinheiro
            </h1>
            <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
              Controle gastos, investimentos e metas em um só lugar, sem complexidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105"
              >
                Começar gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-base"
              >
                Ver como funciona
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Sem cartão de crédito</p>
            <p className="text-xs text-gray-400">
              Privacidade em primeiro lugar. Seus dados nunca são vendidos.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Carousel */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-transparent to-transparent rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
              <div className="bg-gray-50/50 rounded-3xl p-8 shadow-xl shadow-gray-200/30">
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/40 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  
                  {/* Carousel Content */}
                  <div className="relative h-64">
                    {slides.map((slide, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-700 ${
                          index === currentSlide
                            ? 'opacity-100 translate-x-0'
                            : index < currentSlide
                            ? 'opacity-0 -translate-x-full'
                            : 'opacity-0 translate-x-full'
                        }`}
                      >
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-semibold text-gray-900">{slide.title}</h3>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{index === 0 ? 'Saldo disponível' : index === 1 ? 'Fatura total' : 'Progresso'}</p>
                              <p className={`text-3xl font-bold ${index === 0 ? 'text-green-600' : index === 1 ? 'text-orange-600' : 'text-blue-600'}`}>
                                {slide.balance}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                            {slide.cards.map((card, cardIndex) => (
                              <div key={cardIndex} className={`bg-${card.color}-50 rounded-xl p-4`}>
                                <p className={`text-sm text-${card.color}-600 mb-1`}>{card.label}</p>
                                <p className={`text-xl font-bold text-${card.color}-700`}>{card.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    
                    {/* Dots */}
                    <div className="flex gap-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                          }`}
                          aria-label={`Ir para slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Próximo"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Clareza financeira</h3>
              <p className="text-gray-600 leading-relaxed">
                Veja exatamente para onde vai seu dinheiro, sem planilhas complexas ou cálculos manuais.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Controle inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Orçamento automático que se adapta ao seu estilo de vida, sugerindo melhorias naturalmente.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Visão real do patrimônio</h3>
              <p className="text-gray-600 leading-relaxed">
                Acompanhe investimentos e gastos separadamente, construindo riqueza com transparência total.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-16">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Conecte sua renda</h3>
              <p className="text-gray-600">Defina sua renda mensal e o sistema cria automaticamente seu orçamento inteligente.</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Registre gastos e investimentos</h3>
              <p className="text-gray-600">Adicione transações em segundos, com categorização automática e fluxos separados.</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-semibold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tenha clareza total</h3>
              <p className="text-gray-600">Visualize relatórios claros e receba insights para tomar melhores decisões financeiras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Seus dados, sob seu controle</h3>
              <p className="text-gray-600 leading-relaxed">
                Armazenamento local seguro. Seus dados financeiros permanecem no seu dispositivo, sempre.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Privacidade em primeiro lugar</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Sem compartilhamento de dados</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Funciona offline</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Código aberto</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Clareza financeira começa com simplicidade
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram como ter controle total sobre suas finanças.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105"
          >
            Começar agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Clarity Cash</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Clarity Cash. Controle financeiro inteligente.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
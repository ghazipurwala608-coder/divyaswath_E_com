import { 
  Leaf, Shield, Clock, Star, Zap, Gift, 
  ClipboardList, Search, ArrowRight, 
  Heart, Droplet, Lock, Users, Beaker, CheckCircle, Mail, Brain, ShieldCheck, Dumbbell
} from 'lucide-react';

const WellnessQuizPage = () => {
  return (
    <div className="w-full font-sans text-[#1a3a2a]">
      
      {/* =========================================
          1. HERO SECTION 
      ========================================= */}
      <section className="relative w-full overflow-hidden bg-[#faf8f3] flex flex-col md:flex-row min-h-[550px] md:min-h-[650px]">
        {/* Background with Nature Graphic for Right Side */}
        <div className="absolute top-0 right-0 w-full md:w-[50%] h-full">
          <div 
            className="w-full h-full object-cover bg-right bg-cover bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop')",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
              maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
              opacity: 0.9
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Content Column */}
          <div className="w-full md:w-[55%] mb-16 md:mb-0 z-20 md:pr-10">
            {/* Top Title & Decorative Line */}
            <div className="mb-6 flex flex-col items-start">
              <h3 className="text-[15px] md:text-[17px] font-bold tracking-[0.05em] text-[#0e3120] font-serif mb-1">
                WELLNESS QUIZ
              </h3>
              <div className="flex items-center w-48">
                <div className="flex-1 h-[1px] bg-[#d9d0c1]"></div>
                <div className="mx-2 flex gap-[2px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#bc8d40]"></div>
                  <div className="w-2.5 h-1.5 rounded-full bg-[#3e5f49]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#bc8d40]"></div>
                </div>
                <div className="flex-1 h-[1px] bg-[#d9d0c1]"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#092919] leading-tight mb-4 font-bold tracking-tight">
              Discover Your <br />
              <span className="text-[#bc8d40]">Perfect</span> Wellness <br />
              Match
            </h1>
            
            <p className="text-[#132d20] text-sm md:text-base max-w-[320px] mb-8 font-semibold leading-snug">
              Take our quick quiz and get personalized <br className="hidden md:block" />
              product recommendations just for you.
            </p>
            
            {/* Features Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-[10px] md:text-[11px] text-[#092919] font-bold">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-[#c4a161] flex items-center justify-center bg-transparent shrink-0">
                  <Leaf className="w-4 h-4 text-[#2c533c] stroke-[2]" />
                </div>
                <span className="leading-tight">Personalized<br/>Recommendations</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-[#c4a161] flex items-center justify-center bg-transparent shrink-0">
                  <Shield className="w-4 h-4 text-[#2c533c] stroke-[2]" />
                </div>
                <span className="leading-tight">100% Safe &<br/>Confidential</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-[#c4a161] flex items-center justify-center bg-transparent shrink-0">
                  <Clock className="w-4 h-4 text-[#2c533c] stroke-[2]" />
                </div>
                <span className="leading-tight">Takes Just<br/>2 Minutes</span>
              </div>
            </div>
          </div>

          {/* Right Content Column - Interactive / Floating Elements */}
          <div className="w-full md:w-[45%] relative h-[500px] md:h-[600px] flex items-center justify-center z-10">
              {/* Center Person Graphic (Using placeholder) */}
              <div className="absolute bottom-0 h-[90%] w-[80%] md:w-[70%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                 <img 
                   src="https://images.unsplash.com/photo-1544367567-0f2fcb046ebf?auto=format&fit=crop&q=80&w=800&h=1000" 
                   alt="Woman taking a deep breath"
                   className="w-full h-full object-cover object-top rounded-t-full"
                   style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
                 />
              </div>
              
              {/* Floating Badges */}
              <div className="absolute top-[8%] left-[10%] bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 z-20 border border-gray-100">
                  <div className="mb-1"><Star className="w-5 h-5 text-[#2c533c] stroke-[2]" /></div>
                  <span className="text-[9px] md:text-[10px] text-center font-bold leading-tight text-[#1a3a2a] uppercase">Better<br/>Health</span>
              </div>

              <div className="absolute top-[5%] right-[5%] bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 z-20 border border-gray-100">
                  <div className="mb-1"><Shield className="w-5 h-5 text-[#2c533c] stroke-[2]" /></div>
                  <span className="text-[9px] md:text-[10px] text-center font-bold leading-tight text-[#1a3a2a] uppercase">Stronger<br/>Immunity</span>
              </div>

              <div className="absolute top-[45%] left-[-5%] bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 z-20 border border-gray-100">
                  <div className="mb-1"><Zap className="w-5 h-5 text-[#2c533c] stroke-[2]" /></div>
                  <span className="text-[9px] md:text-[10px] text-center font-bold leading-tight text-[#1a3a2a] uppercase">More<br/>Energy</span>
              </div>

              <div className="absolute top-[55%] right-[-5%] bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 z-20 border border-gray-100">
                  <div className="mb-1"><Leaf className="w-5 h-5 text-[#2c533c] stroke-[2]" /></div>
                  <span className="text-[9px] md:text-[10px] text-center font-bold leading-tight text-[#1a3a2a] uppercase">Balanced<br/>Wellness</span>
              </div>

              {/* Bottom Offer Banner */}
              <div className="absolute bottom-[2%] left-0 right-0 md:left-[-10%] md:right-[5%] bg-gradient-to-r from-[#0a2614] to-[#123820] rounded-[24px] p-4 md:px-8 md:py-5 shadow-[0_10px_40px_-10px_rgba(188,141,64,0.4)] border border-[#bc8d40]/40 flex items-center gap-5 z-30 transition-transform hover:scale-[1.02] cursor-pointer">
                  <div className="bg-gradient-to-b from-[#1a4a2e] to-[#0a2614] p-3 md:p-5 rounded-2xl flex-shrink-0 shadow-inner border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-[#bc8d40]"></div>
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-2 bg-[#bc8d40]"></div>
                      <Gift className="w-8 h-8 md:w-10 md:h-10 text-[#f5d580] relative z-10" />
                  </div>
                  <div className="flex-1">
                      <p className="text-[#f5f5f5] text-sm md:text-base font-medium mb-1">Complete the quiz & get</p>
                      <p className="text-[#e8c678] font-serif font-bold text-xl md:text-3xl tracking-wide leading-tight mb-1.5">EXCLUSIVE OFFERS</p>
                      <p className="text-gray-300 text-xs md:text-sm font-medium">on products that suit you best!</p>
                  </div>
                  <div className="absolute top-3 right-6 w-2 h-2 bg-[#bc8d40] rounded-full blur-[1px]"></div>
                  <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px]"></div>
              </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. HOW IT WORKS SECTION 
      ========================================= */}
      <section className="py-16 md:py-20 px-6 max-w-[1200px] mx-auto text-center border-b border-gray-100 bg-white">
        <div className="mb-12 flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.1em] text-[#0e3120] font-serif mb-2 uppercase">HOW IT WORKS</h2>
            <div className="flex items-center w-24">
              <div className="flex-1 h-[1px] bg-[#d9d0c1]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#bc8d40] mx-1"></div>
              <div className="flex-1 h-[1px] bg-[#d9d0c1]"></div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="flex-1 max-w-[300px] bg-[#fdfdfb] border border-gray-200 rounded-2xl p-6 flex items-center text-left gap-4 shadow-sm relative hover:shadow-md transition-shadow">
                <div className="bg-[#eef2ef] p-3 rounded-full flex-shrink-0 relative text-[#2c533c]">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-[#dce5df] rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
                    <ClipboardList className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="font-bold text-[14px] text-[#0e3120] mb-1">Answer Simple Questions</h4>
                    <p className="text-[12px] text-gray-600 leading-tight">Tell us about your lifestyle, health goals & concerns.</p>
                </div>
            </div>
            
            {/* Arrow 1 */}
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

            {/* Step 2 */}
            <div className="flex-1 max-w-[300px] bg-[#fdfdfb] border border-gray-200 rounded-2xl p-6 flex items-center text-left gap-4 shadow-sm relative hover:shadow-md transition-shadow">
                <div className="bg-[#eef2ef] p-3 rounded-full flex-shrink-0 relative text-[#2c533c]">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-[#dce5df] rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
                    <Search className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="font-bold text-[14px] text-[#0e3120] mb-1">We Analyze Your Needs</h4>
                    <p className="text-[12px] text-gray-600 leading-tight">Our wellness intelligence finds what your body truly needs.</p>
                </div>
            </div>

            {/* Arrow 2 */}
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

            {/* Step 3 */}
            <div className="flex-1 max-w-[300px] bg-[#fdfdfb] border border-gray-200 rounded-2xl p-6 flex items-center text-left gap-4 shadow-sm relative hover:shadow-md transition-shadow">
                <div className="bg-[#eef2ef] p-3 rounded-full flex-shrink-0 relative text-[#2c533c]">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-[#dce5df] rounded-full flex items-center justify-center text-[10px] font-bold">3</div>
                    <Gift className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="font-bold text-[14px] text-[#0e3120] mb-1">Get Personalized Results</h4>
                    <p className="text-[12px] text-gray-600 leading-tight">Receive product recommendations made just for you.</p>
                </div>
            </div>
        </div>
      </section>

      {/* =========================================
          3. CATEGORIES SECTION 
      ========================================= */}
      <section className="py-16 md:py-20 px-6 max-w-[1300px] mx-auto text-center bg-white">
        <div className="mb-10 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-[0.05em] text-[#0e3120] font-serif mb-3 uppercase">LET&apos;S FIND WHAT YOUR BODY NEEDS</h2>
            <p className="text-sm font-semibold text-gray-700">Choose the area you&apos;d like to focus on</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            
            {/* Category 1 */}
            <div className="bg-[#fcfaf7] border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="pt-6 pb-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:bg-[#eef2ef] transition-colors">
                        <ShieldCheck className="w-6 h-6 text-[#2c533c]" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0e3120]">Immunity &<br/>Wellness</h3>
                </div>
                <div className="h-32 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60" alt="Immunity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white">
                    <p className="text-[11px] text-gray-600 font-medium">Boost immunity &<br/>stay healthy</p>
                </div>
            </div>

            {/* Category 2 */}
            <div className="bg-[#fcfaf7] border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="pt-6 pb-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:bg-[#eef2ef] transition-colors">
                        <Zap className="w-6 h-6 text-[#2c533c]" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0e3120]">Energy &<br/>Vitality</h3>
                </div>
                <div className="h-32 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&auto=format&fit=crop&q=60" alt="Energy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white">
                    <p className="text-[11px] text-gray-600 font-medium">Improve energy,<br/>stamina & reduce fatigue</p>
                </div>
            </div>

            {/* Category 3 */}
            <div className="bg-[#fcfaf7] border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="pt-6 pb-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:bg-[#eef2ef] transition-colors">
                        <Heart className="w-6 h-6 text-[#2c533c]" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0e3120]">Digestion &<br/>Gut Health</h3>
                </div>
                <div className="h-32 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop&q=60" alt="Digestion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white">
                    <p className="text-[11px] text-gray-600 font-medium">Better digestion,<br/>gut balance & detox</p>
                </div>
            </div>

            {/* Category 4 */}
            <div className="bg-[#fcfaf7] border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="pt-6 pb-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:bg-[#eef2ef] transition-colors">
                        <Dumbbell className="w-6 h-6 text-[#2c533c]" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0e3120]">Weight<br/>Management</h3>
                </div>
                <div className="h-32 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60" alt="Weight" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white">
                    <p className="text-[11px] text-gray-600 font-medium">Healthy weight<br/>management</p>
                </div>
            </div>

            {/* Category 5 */}
            <div className="bg-[#fcfaf7] border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="pt-6 pb-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:bg-[#eef2ef] transition-colors">
                        <Brain className="w-6 h-6 text-[#2c533c]" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0e3120]">Mental Wellness &<br/>Stress Support</h3>
                </div>
                <div className="h-32 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&auto=format&fit=crop&q=60" alt="Mental Wellness" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white">
                    <p className="text-[11px] text-gray-600 font-medium">Reduce stress,<br/>improve focus & mood</p>
                </div>
            </div>

            {/* Category 6 */}
            <div className="bg-[#fcfaf7] border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="pt-6 pb-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:bg-[#eef2ef] transition-colors">
                        <Droplet className="w-6 h-6 text-[#2c533c]" />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0e3120]">Skin, Hair &<br/>Beauty</h3>
                </div>
                <div className="h-32 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&auto=format&fit=crop&q=60" alt="Skin and Hair" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 bg-white">
                    <p className="text-[11px] text-gray-600 font-medium">Healthy skin, strong hair<br/>& natural glow</p>
                </div>
            </div>

        </div>
      </section>

      {/* =========================================
          4. CTA BANNER
      ========================================= */}
      <section className="px-4 md:px-6 mb-12">
        <div className="max-w-[1200px] mx-auto bg-[#0a2717] rounded-xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center py-10 px-8 md:px-16 justify-between border border-[#bc8d40]/20">
            
            {/* Left Decorative Image Placeholder */}
            <div className="hidden md:block absolute left-[-2%] bottom-0 h-[120%] opacity-40 mix-blend-screen pointer-events-none">
                <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop" alt="leaves" className="w-full h-full object-contain" />
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-3 font-semibold tracking-wide">
                    Ready to start your wellness journey?
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-8 max-w-lg">
                    Take the quiz and take the first step towards a healthier you.
                </p>
                
                <button className="bg-gradient-to-r from-[#d9a05b] to-[#c78b3e] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                    START QUIZ NOW
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Right Badge */}
            <div className="relative z-10 flex-shrink-0 border-[1.5px] border-[#bc8d40] rounded-full w-32 h-32 flex flex-col items-center justify-center p-4 bg-[#0a2717]/80 backdrop-blur-sm shadow-[0_0_30px_rgba(188,141,64,0.15)]">
                <span className="text-white font-bold text-2xl leading-none mb-1">100%</span>
                <span className="text-[#bc8d40] text-[8px] font-bold tracking-widest uppercase mb-2">CONFIDENTIAL</span>
                <Lock className="w-6 h-6 text-[#bc8d40]" />
            </div>

            {/* Right Decorative Image Placeholder */}
            <div className="hidden md:block absolute right-[-5%] top-0 h-full opacity-40 mix-blend-screen pointer-events-none">
                <img src="https://images.unsplash.com/photo-1615486171430-b99616d26be5?q=80&w=400&auto=format&fit=crop" alt="botanical" className="w-full h-full object-contain" />
            </div>
        </div>
      </section>

      {/* =========================================
          5. TRUST INDICATORS
      ========================================= */}
      <section className="bg-[#faf8f3] py-8 border-y border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-6 text-[#1a3a2a]">
              
              <div className="flex items-center gap-3 w-[45%] md:w-auto">
                  <div className="p-2 bg-white rounded-full border border-gray-200 shadow-sm"><Users className="w-6 h-6 text-[#2c533c]" /></div>
                  <div className="text-xs font-bold leading-tight">Trusted by<br/>10,000+ People</div>
              </div>
              
              <div className="flex items-center gap-3 w-[45%] md:w-auto">
                  <div className="p-2 bg-white rounded-full border border-gray-200 shadow-sm"><Beaker className="w-6 h-6 text-[#2c533c]" /></div>
                  <div className="text-xs font-bold leading-tight">Expert Formulated<br/>Ayurvedic Solutions</div>
              </div>
              
              <div className="flex items-center gap-3 w-[45%] md:w-auto">
                  <div className="p-2 bg-white rounded-full border border-gray-200 shadow-sm"><Leaf className="w-6 h-6 text-[#2c533c]" /></div>
                  <div className="text-xs font-bold leading-tight">Natural Ingredients<br/>You Can Trust</div>
              </div>
              
              <div className="flex items-center gap-3 w-[45%] md:w-auto">
                  <div className="p-2 bg-white rounded-full border border-gray-200 shadow-sm"><CheckCircle className="w-6 h-6 text-[#2c533c]" /></div>
                  <div className="text-xs font-bold leading-tight">Safe, Effective &<br/>Backed by Science</div>
              </div>

          </div>
      </section>

      {/* =========================================
          6. FOOTER SUBSCRIPTION
      ========================================= */}
      <section className="bg-[#092919] w-full py-10 px-6 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
              
              {/* Left Side */}
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                  <div className="w-16 h-16 rounded-full border border-[#bc8d40] bg-[#123622] flex items-center justify-center">
                      <Mail className="w-8 h-8 text-[#bc8d40]" />
                  </div>
                  <div>
                      <h3 className="text-white font-bold text-lg tracking-wider mb-1">STAY UPDATED ON WELLNESS</h3>
                      <p className="text-gray-300 text-sm">Get health tips, exclusive offers & updates.</p>
                  </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-full md:w-auto flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full md:w-72 bg-white px-4 py-3 rounded-l-md outline-none text-gray-800 text-sm border-none"
                  />
                  <button className="bg-[#bc8d40] hover:bg-[#a67a33] text-white font-bold px-6 py-3 rounded-r-md transition-colors text-sm tracking-wider">
                      SUBSCRIBE
                  </button>
              </div>

          </div>
          
          {/* Subtle mortar placeholder on right */}
          <div className="hidden lg:block absolute right-[-5%] bottom-[-20%] w-[300px] h-[300px] opacity-20 pointer-events-none mix-blend-screen">
            <img src="https://images.unsplash.com/photo-1596647900762-bbaeaeb42327?q=80&w=400&auto=format&fit=crop" alt="Mortar" className="w-full h-full object-contain" />
          </div>
      </section>

    </div>
  );
};

export default WellnessQuizPage;

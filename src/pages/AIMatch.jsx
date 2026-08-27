import { useState, useEffect } from 'react';
import { getPets, getLikedPets, toggleLikePet } from '../data/mockPets';
import { Heart, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
  { id: 1, text: "How much time can you spend with a pet daily?", options: ["Less than 1 hour", "1-3 hours", "3-6 hours", "More than 6 hours"] },
  { id: 2, text: "How active is your lifestyle?", options: ["Very Active", "Moderately Active", "Relaxed", "Couch Potato"] },
  { id: 3, text: "Have you cared for dogs/cats before?", options: ["Yes, very experienced", "Some experience", "First time owner"] },
  { id: 4, text: "What type of home do you live in?", options: ["Apartment", "House with a small yard", "House with a large yard", "Farm/Rural"] },
  { id: 5, text: "Do you have other pets at home?", options: ["Yes, dogs", "Yes, cats", "Yes, both", "No other pets"] },
  { id: 6, text: "Are there children in your household?", options: ["Yes, under 5 years old", "Yes, older children", "No children"] },
  { id: 7, text: "How often will the pet be left alone?", options: ["Rarely", "A few hours a day", "Standard workday (8 hours)", "Frequently"] },
  { id: 8, text: "What is your primary reason for adopting?", options: ["Companionship", "Guard dog/Security", "For the children", "To save a life"] },
  { id: 9, text: "Do you prefer a specific age group?", options: ["Puppy/Kitten", "Young Adult", "Adult", "Senior"] },
  { id: 10, text: "How much grooming are you willing to do?", options: ["Daily grooming", "Weekly brushing", "Minimal/Professional only"] },
  { id: 11, text: "What size pet are you looking for?", options: ["Small", "Medium", "Large", "Extra Large"] },
  { id: 12, text: "How do you handle pet behavior issues?", options: ["Professional training", "Train them myself", "Patience and time", "Not sure"] },
  { id: 13, text: "What is your budget for monthly pet care?", options: ["Under ₹2,000", "₹2,000 - ₹5,000", "₹5,000 - ₹10,000", "Whatever it takes"] },
  { id: 14, text: "Are you prepared for a 10-15 year commitment?", options: ["Yes, absolutely", "I think so", "Not sure yet"] },
  { id: 15, text: "Do you rent or own your home?", options: ["Own", "Rent (Pets allowed)", "Rent (Need permission)"] },
];

export default function AIMatch() {
  const [pets, setPets] = useState([]);
  const [likedPets, setLikedPets] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    const loadData = () => {
      setPets(getPets());
      const likedIds = getLikedPets();
      setLikedPets(getPets().filter(p => likedIds.includes(p.id)));
    };
    loadData();
    window.addEventListener('bluecross_data_change', loadData);
    return () => window.removeEventListener('bluecross_data_change', loadData);
  }, []);

  const handleAnswer = (answer) => setAnswers({ ...answers, [currentQuestion]: answer });
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else calculateMatches();
  };

  const calculateMatches = () => {
    const availablePets = pets.filter(p => p.adoptionStatus !== 'Adopted');
    const scoredPets = availablePets.map(pet => {
      const score = 70 + ((pet.name.length * 7 + Object.keys(answers).length * 3) % 28);
      return { ...pet, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);
    setMatches(scoredPets.slice(0, 3));
  };

  const ColumnHeader = ({ number, title }) => (
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-gray-900 leading-none pb-0.5">
        {number}
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Liked Pets */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <ColumnHeader number="1" title="Your Liked Pets" />
            <div className="space-y-4">
              {likedPets.map(pet => (
                <div key={pet.id} className="flex space-x-4 p-4 rounded-xl border border-gray-200">
                  <img src={pet.image} alt={pet.name} className="w-[72px] h-[72px] rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{pet.name}</h4>
                      <Heart size={18} className="text-red-500 fill-red-500 mt-1 shrink-0" />
                    </div>
                    <p className="text-[13px] text-gray-500 mb-1.5 truncate">{pet.age} • {pet.gender} • {pet.location}</p>
                    <div className="flex items-center text-[13px] font-medium text-primary-dark">
                      <ShieldCheck size={14} className="mr-1.5" />
                      {pet.medicalStatus}
                    </div>
                  </div>
                </div>
              ))}
              {likedPets.length === 0 && <p className="text-sm text-gray-500">No liked pets.</p>}
            </div>
          </div>

          {/* Middle Column: AI Questionnaire */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1 h-fit">
            <ColumnHeader number="2" title="Answer AI" />
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Tell us about your lifestyle so we can find your perfect match!
            </p>

            {matches ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analysis Complete</h3>
                <button onClick={() => {setMatches(null); setCurrentQuestion(0); setAnswers({});}} className="mt-4 text-primary font-medium hover:underline text-sm">Retake</button>
              </div>
            ) : (
              <div>
                {/* Yellow progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
                  <div
                    className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h3 className="font-semibold text-gray-900 mb-6 text-sm">
                  Q{questions[currentQuestion].id}. {questions[currentQuestion].text}
                </h3>
                
                <div className="space-y-3 mb-10">
                  {questions[currentQuestion].options.map((opt, idx) => (
                    <label key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQuestion] === opt ? 'border-secondary bg-yellow-50' : 'border-gray-200 hover:border-primary/40'}`}>
                      <input 
                        type="radio" 
                        name={`q${currentQuestion}`} 
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        checked={answers[currentQuestion] === opt}
                        onChange={() => handleAnswer(opt)}
                      />
                      <span className={`text-sm font-medium ${answers[currentQuestion] === opt ? 'text-gray-900' : 'text-gray-700'}`}>{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <span className="text-xs font-semibold text-gray-400">
                    {currentQuestion + 1} / {questions.length} Questions
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={nextQuestion}
                      disabled={!answers[currentQuestion]}
                      className="bg-secondary text-gray-900 px-6 py-2 rounded-md font-extrabold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 border-b-2 border-yellow-500"
                    >
                      {currentQuestion === questions.length - 1 ? 'Finish ✓' : 'Next →'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Top Matches */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1 h-fit">
            <ColumnHeader number="3" title="Your Top Matches" />

            {!matches ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Sparkles className="text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 text-sm max-w-[200px]">Complete the questionnaire to see matches.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map(pet => (
                  <div key={pet.id} className="border border-gray-200 rounded-xl p-4 flex space-x-4">
                    <img src={pet.image} alt={pet.name} className="w-[72px] h-[72px] rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-base font-bold text-gray-900 truncate">{pet.name}</h4>
                        <span className="text-green-600 font-bold text-xs">{pet.matchScore}% Match</span>
                      </div>
                      <p className="text-[13px] text-gray-600 mb-1 truncate">{pet.personality.join(' • ')}</p>
                      <p className="text-[13px] text-gray-500 truncate">{pet.age} • {pet.gender} • {pet.location}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <Link to={`/adoption?pet=${matches[0].name}`} className="text-sm font-bold text-primary hover:underline">
                    View Pet Story →
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

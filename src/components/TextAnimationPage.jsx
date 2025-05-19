import RotatingText from './RotatingText';

export default function TextAnimationPage() {
  return (
    <div className="flex flex-col items-start justify-center min-h-screen p-8 bg-gray-100">
      {/* Fixed heading */}
      <h1 className="text-6xl font-bold text-gray-900">
        Build AI Agents
      </h1>
      
      {/* Using your existing RotatingText component */}
      <RotatingText
        texts={['with ease', 'on cloud', 'in minutes', 'that scale']}
        mainClassName="text-4xl font-bold mt-2" 
        staggerFrom="first"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        staggerDuration={0.03}
        splitBy="words" // Important change here!
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />
    </div>
  );
}
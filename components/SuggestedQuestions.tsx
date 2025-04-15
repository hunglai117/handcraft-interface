import { motion } from 'framer-motion';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions = ({ questions, onSelectQuestion }: SuggestedQuestionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto mb-6"
    >
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {questions.map((question, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="p-3 border border-subtle rounded-lg bg-white hover:bg-subtle/30 text-left text-textDark font-body transition-colors"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

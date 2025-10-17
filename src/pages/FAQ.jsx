import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      q: "What is Qiskit Fall Fest?",
      a: "Qiskit Fall Fest is a global student-run series of quantum computing events supported by IBM Quantum. Our IIIT Srikakulam edition features hands-on workshops, guided notebooks, and a campus hackathon."
    },
    {
      q: "Who can participate?",
      a: "The event is open to all students from any academic institution. No prior quantum computing experience is required for beginners' workshops."
    },
    {
      q: "Is there a registration fee?",
      a: "No, the event is completely free for all participants thanks to our sponsors and IBM Quantum support."
    },
    {
      q: "What should I bring?",
      a: "Bring your laptop with a modern web browser for accessing Jupyter notebooks and Qiskit online. We'll provide the rest!"
    },
    {
      q: "Will food be provided?",
      a: "Yes, we'll provide meals, snacks, and refreshments throughout the three-day event."
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">Got questions? We've got answers!</p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card border border-white/10 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </motion.div>
  );
};

export default FAQ;
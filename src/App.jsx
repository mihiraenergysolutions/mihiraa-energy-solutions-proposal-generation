import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProposalForm from "./pages/ProposalForm";
import ProposalPrint from "./pages/ProposalPrint";
import ProposalDetails from "./pages/ProposalDetails";
import ProposalList from "./pages/ProposalList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProposalList />} />
      <Route path="/proposal" element={<ProposalForm />} />
      <Route path="/print" element={<ProposalPrint />} />
      <Route path="/proposal/:id" element={<ProposalDetails />} />
      <Route path="/proposal-form/:id" element={<ProposalForm />} />
    </Routes>
  );
}

export default App;

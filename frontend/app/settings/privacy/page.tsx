import ProtectedRoute from "@/components/guards/ProtectedRoute";

const PrivacyPage = () => {
  return (
    <ProtectedRoute>
      <div>PrivacyPage</div>
    </ProtectedRoute>
  );
};

export default PrivacyPage;

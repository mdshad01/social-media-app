import ProtectedRoute from "@/components/guards/ProtectedRoute";
import Privacy from "@/components/settings/Content/Privacy";

const PrivacyPage = () => {
  return (
    <ProtectedRoute>
      <div><Privacy/></div>
    </ProtectedRoute>
  );
};

export default PrivacyPage;

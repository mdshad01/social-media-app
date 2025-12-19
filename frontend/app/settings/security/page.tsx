import Security from "@/components/settings/Content/Security";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

const SecurityPage = () => {
  return (
    <ProtectedRoute>
      <Security />
    </ProtectedRoute>
  );
};

export default SecurityPage;

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import Appearance from "@/components/settings/Content/Appearance";

const AppearencePage = () => {
  return (
    <ProtectedRoute>
      <Appearance />
    </ProtectedRoute>
  );
};

export default AppearencePage;

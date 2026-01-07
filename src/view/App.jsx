import AdminRoutes from "./adminPages/adminRoutes";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LoginModal from "./components/boostrap/loginModal";
import HeaderPage from "./components/headerPage";
import TopAlertProvider from "../provider/alertProvider";
import { LoadingProvider } from "../provider/loadingProvider";
import UserRoutes from "./userPages/userRoutes";
import { UserProvider } from "../provider/userProvider";
import ProtectedRoute from "../provider/protectedRoute";
import { AcadYearProvider } from "../provider/acadyearProvider";

function App() {
	const isMaintenance = false;

	return isMaintenance ? (
		<div className="text-center mt-5">
			<h1>🚧 Site Under Maintenance 🚧</h1>
			<p>We'll be back soon!</p>
		</div>
	) : (
		<TopAlertProvider>
			<LoadingProvider>
				<LoginModal />
				<AcadYearProvider>
					<HeaderPage />
					<UserRoutes />
					<UserProvider>
						<ProtectedRoute>
							<AdminRoutes />
						</ProtectedRoute>
					</UserProvider>
				</AcadYearProvider>
			</LoadingProvider>
		</TopAlertProvider>
	);
}

export default App;

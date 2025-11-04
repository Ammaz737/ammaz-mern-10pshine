import { motion } from "framer-motion";

const PasswordStrengthMeter = ({ password }) => {
	const getPasswordStrength = () => {
		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[a-z]/.test(password)) score++;
		if (/\d/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	};

	const strength = getPasswordStrength();

	const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
	const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

	return (
		<div className='flex items-center mt-2'>
			<div className='w-full bg-gray-700 rounded-full h-2 mr-2'>
				<motion.div
					className={`h-2 rounded-full ${strengthColors[strength - 1] || "bg-gray-700"}`}
					initial={{ width: 0 }}
					animate={{ width: `${(strength / 5) * 100}%` }}
					transition={{ duration: 0.5 }}
				/>
			</div>
			<span className={`text-sm ${strength > 2 ? "text-green-400" : "text-yellow-400"}`}>
				{strengthLabels[strength - 1] || ""}
			</span>
		</div>
	);
};
export default PasswordStrengthMeter;

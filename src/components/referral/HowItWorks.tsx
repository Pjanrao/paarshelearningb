export default function HowItWorks() {
    const steps = [
        "Share your unique referral code with friends",
        "Your friend signs up using your referral link",
        "They purchase and complete their first course",
        "Both of you receive your rewards automatically",
    ];

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">How It Works</h2>
            <ul className="space-y-5">
                {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-[#2C4276] font-bold text-sm">
                            {i + 1}
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed pt-1">{step}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
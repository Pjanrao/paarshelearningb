"use client";

import { Gift, BadgeCheck, Users, Zap } from "lucide-react";

export default function RewardsSection() {
    const rewards = [
        {
            icon: Gift,
            title: "10% Discount",
            desc: "Your friend gets 10% off their first course purchase",
        },
        {
            icon: BadgeCheck,
            title: "₹50 Cashback",
            desc: "You earn ₹50 when your friend completes their first course",
        },
        {
            icon: Users,
            title: "Unlimited Referrals",
            desc: "No limit on how many friends you can refer",
        },
        {
            icon: Zap,
            title: "Quick Rewards",
            desc: "Rewards credited within 24 hours of qualification",
        },
    ];

    return (
        <div className="bg-gradient-to-r from-[#2C4276]/10 to-blue-100 p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold text-center mb-6 text-[#2C4276]">
                Rewards You and Your Friends will Both Receive
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
                {rewards.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-5 shadow hover:shadow-md transition"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 mb-3">
                            <item.icon className="text-[#2C4276]" size={20} />
                        </div>

                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
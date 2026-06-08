import React from 'react';

const SystemRules = () => {
    const rules = [
        "STOCK INCREMENTS AUTOMATICALLY ON ELIMINATION",
        "RECORD IS READ ONLY ONCE POSTED",
        "AUDIT TRAIL GENERATED AUTOMATICALLY",
        "RETURNS TO ASSIGNED ON SAVE — ARBITRARY"
    ];

    return (
        <div className="bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] rounded-xl border border-gray-200 p-5 text-white">
           <div className='flex item-center gap-2 mb-4' >
             <img src="Icon (5).svg" alt="" />
            <h2 className="text-base font-semibold text-white ">System Rules</h2>
           </div>
            
            <div className="space-y-2">
                {rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                        <span className="text-sm text-white/90 font-medium">{rule}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemRules;
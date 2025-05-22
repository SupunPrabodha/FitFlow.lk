import React from "react";
import { FaEnvelopeOpenText } from "react-icons/fa6";
const requestPlan = () => {
    return (
        <div>
            <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    {" "}
                    <FaEnvelopeOpenText />
                    Request for a Plan
                </h3>
                <p className="text-primary/75 text-base mb-4">
                    Need a personalized workout or meal plan? Reach out via email, and I'll create one just for you!
                </p>
                <div className="w-full space y-4">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="name@gmail.com"
                        className="w-full block py-2 pl-3 border focus:outline-none"
                    />
                    <input
                        type="submit"
                        value={"Submit"}
                        className="w-full block py-2 pl-3 boder focus:outline-none bg-blue rounded-sm text-white cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default requestPlan;

import React from "react";

const PageHeader = () => {
    return (
        <div className="py-24 mt-3 bg-[#928dab]rounded flex items-center justify-center">
            <div>
                <h2 className="text-3xl text-blue font-medium mb-1 text-center">Single Plan Page</h2>
                <p>
                    <a href="/">Home </a> /Single Plan{" "}
                </p>
            </div>
        </div>
    );
};

export default PageHeader;

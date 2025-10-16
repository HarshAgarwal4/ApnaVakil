import React from 'react';
import Article from './Article';
import Lawyers from './Lawyers';

const RightSidebar = () => {
    return (
        <aside className="w-80 bg-white p-6 border-l hidden lg:flex flex-col gap-6">
            <Article />
            <Lawyers />
        </aside>
    );
};

export default RightSidebar;
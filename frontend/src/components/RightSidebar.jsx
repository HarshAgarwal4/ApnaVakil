import React from 'react';
import Article from './Article';
import Lawyers from './Lawyers';
import { useContext } from 'react';
import { AppContext } from '../context/GlobalContext';

const RightSidebar = () => {
    const {showPrintPage, setShowPrintPage, setPrint, print} = useContext(AppContext)
    return (
        <aside className="w-80 bg-white p-6 border-l hidden lg:flex flex-col gap-6">
            <button onClick={() => {setShowPrintPage(true)}} className='bg-gray-50 p-4 overflow-auto rounded-lg hover:bg-blue-500 hover:text-white'>
                Print
            </button>
            <Article />
            <Lawyers />
        </aside>
    );
};

export default RightSidebar;
import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/GlobalContext';

const Article = () => {
    const {article, setArticle} = useContext(AppContext)
    return (
        <div className="bg-gray-50 p-4 h-[20vh] overflow-auto rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">📖 Related Section</h3>
            <p className="text-sm text-gray-600">{article?article:<span>No query found</span>}</p>
        </div>
    );
};

export default Article;
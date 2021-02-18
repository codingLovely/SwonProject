import React from 'react';

const Pagination = ({postsPerPage,totalPosts,paginate}) =>{
    const pageNumbers = [];

    for(let i = 1;i <= Math.ceil(totalPosts/postsPerPage);i++){
        pageNumbers.push(i);

    }
    return(
        <nav id = "pageCenter">
            <ul className = "pagination" style = {{ margin:0, padding:0}} >
                {pageNumbers.map(number =>(
                    <li key = {number} className = "pageItem" style = {{float:"left",  margin:0, padding:0}}>
                        <a onClick={()=>paginate(number)} className = "pageLink">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
export default Pagination;
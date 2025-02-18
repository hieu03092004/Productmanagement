let count=0;
const createTree=(arr,parentId="")=>{
    const tree=[];
        arr.forEach((item)=>{
            if(item.parent_id===parentId){
                count++;
                item.index=count;
                const children=createTree(arr,item.id);
                if(children.length>0){
                    item.children=children;
                }
                tree.push(item);
            }
        })
        return tree;
}
module.exports.Tree =(arr,parentId="")=>{
    count=0;
    return createTree(arr,parentId);
}
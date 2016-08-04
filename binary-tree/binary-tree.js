'use strict';

class BinaryTree {
	constructor() {

		this.root = null;

	}

	insert(data) {

		//create a new item object, place data in
        var node = new Node(data,null,null);
        var current;

        //special case: no items in the tree yet
        if (this.root === null){
            this.root = node;
        } else {
            current = this.root;

            while(true){

                //if the new value is less than this node's value, go left
                if (data < current.data){

                    //if there's no left, then the new node belongs there
                    if (current.left === null){
                        current.left = node;
                        break;
                    } else {
                        current = current.left;
                    }

                //if the new value is greater than this node's value, go right
                } else if (data > current.data){

                    //if there's no right, then the new node belongs there
                    if (current.right === null){
                        current.right = node;
                        break;
                    } else {
                        current = current.right;
                    }       

                //if the new value is equal to the current one, just ignore
                } else {
                    break;
                }
            }
        }

	}

	contains(data) {

		var found = false,
            current = this.root;

        //make sure there's a node to search
        while(!found && current){

            //if the value is less than the current node's, go left
            if (data < current.data){
                current = current.left;

            //if the value is greater than the current node's, go right
            } else if (data > current.data){
                current = current.right;

            //values are equal, found it!
            } else {
                found = true;
            }
        }

        //only proceed if the node was found
        return found;
    }


    remove(data){
            var found = false,
            parent = null,
            current = this.root,
            childCount,
            replacement,
            replacementParent;
            
        //make sure there's a node to search
        while(!found && current){
        
            //if the value is less than the current node's, go left
            if (data < current.data){
                parent = current;
                current = current.left;
                
            //if the value is greater than the current node's, go right
            } else if (data > current.data){
                parent = current;
                current = current.right;
                
            //values are equal, found it!
            } else {
                found = true;
            }
        }
        
        //only proceed if the node was found
        if (found){
        
            //figure out how many children
            childCount = (current.left !== null ? 1 : 0) + (current.right !== null ? 1 : 0);
        
            //special case: the value is at the root
            if (current === this.root){
                switch(childCount){
                
                    //no children, just erase the root
                    case 0:
                        this.root = null;
                        break;
                        
                    //one child, use one as the root
                    case 1:
                        this.root = (current.right === null ? current.left : current.right);
                        break;
                        
                    //two children, little work to do
                    case 2:

                    //new root will be the old root's left child...maybe
                        replacement = this.root.left;
                        
                    //find the right-most leaf node to be the real new root
                        while (replacement.right !== null){
                            replacementParent = replacement;
                            replacement = replacement.right;
                        }
         
                    //it's not the first node on the left
                        if (replacementParent !== null){
                        
                    //remove the new root from it's previous position
                            replacementParent.right = replacement.left;
                            
                    //give the new root all of the old root's children
                            replacement.right = this.root.right;
                            replacement.left = this.root.left;
                        } else {
                        
                    //just assign the children
                            replacement.right = this.root.right;
                        }
                        
                    //officially assign new root
                        this.root = replacement;
                    
                }        

            //non-root values
            } else {
            
                switch (childCount){
                
                    //no children, just remove it from the parent
                    case 0:
                        //if the current value is less than its parent's, null out the left pointer
                        if (current.data < parent.data){
                            parent.left = null;
                            
                        //if the current value is greater than its parent's, null out the right pointer
                        } else {
                            parent.right = null;
                        }
                        break;
                        
                    //one child, just reassign to parent
                    case 1:
                        //if the current value is less than its parent's, reset the left pointer
                        if (current.data < parent.data){
                            parent.left = (current.left === null ? current.right : current.left);
                            
                        //if the current value is greater than its parent's, reset the right pointer
                        } else {
                            parent.right = (current.left === null ? current.right : current.left);
                        }
                        break;    

                    //two children, a bit more complicated
                    case 2:
                        //reset pointers for new traversal
                        replacement = current.left;
                        replacementParent = current;
                        
                        //find the right-most node
                        while(replacement.right !== null){
                            replacementParent = replacement;
                            replacement = replacement.right;                            
                        }
                        //it's not the first node on the left
                        if (current.left!==replacement){                        
                            //remove the replacement from it's previous position
                            replacementParent.right = replacement.left;                 
                        //assign children to the replacement
                            replacement.right = current.right;
                            replacement.left = current.left;
                        //it's the first node on the left
                        } else {                        
                            //just assign the children
                            replacement.right = current.right;
                        }

                        //place the replacement in the right spot
                        if (current.data < parent.data){
                            parent.left = replacement;
                        } else {
                            parent.right = replacement;
                        }                        
                                     
                }
            
            }
        
        }
        
    }

	size() {
        function count(current) {
            if (current == null) return 0;
            return 1 + count(current.left) + count(current.right);
        }
        	return count(this.root);
	}


	isEmpty() {

	if(this.root===null)
		return true;
	else
		return false;
	}
}

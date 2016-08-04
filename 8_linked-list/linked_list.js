function Node(value) {
    this.data = value;
    this.prev = null;
    this.next = null;
}

function DoublyList() {
    this._length = 0;
    this._head = null;
    this._tail = null;
}

DoublyList.prototype.head = function() {
    return this._head.data;
};

DoublyList.prototype.tail = function() {
    return this._tail.data;
};

DoublyList.prototype.append = function(data) {
    var node = new Node(data);

    if (this._length) {
        this._tail.next = node;
        node.prev = this._tail;
        this._tail = node;
    } else {
        this._head = node;
        this._tail = node;
    }
    this._length++;
    return this;
};

DoublyList.prototype.at = function(index) {
    var currentNode = this._head,
        length = this._length,
        count = 0;

    if (this._length !== 0 && index >= 0 && index < this._length) {
        while (count < index) {
            currentNode = currentNode.next;
            count++;
        }
        return currentNode.data;
    } else {
        return null;
    }
};

DoublyList.prototype.insertAt = function(index, data) {
    var newNode = new Node(data),
        currentNode = this._head,
        replaceNode = null,
        replacePrevNode = null,
        count = 0;

    if (this._length !== 0 && index >= 0 && index < this._length) {
        if (index === 0) {
            replaceNode = this._head;
            newNode.prev = null;
            newNode.next = replaceNode;
            replaceNode.prev = newNode;
            this._head = newNode;
        } else {
            while (count < index) {
                currentNode = currentNode.next;
                count++;
            }

            replaceNode = currentNode;
            replacePrevNode = currentNode.prev;

            replacePrevNode.next = newNode;
            newNode.prev = replacePrevNode;

            newNode.next = replaceNode;
            replaceNode.prev = newNode;
        }
        this._length++;
    }
    return this;
};


DoublyList.prototype.deleteAt = function(index) {
    var currentNode = this._head,
        length = this._length,
        count = 0,
        beforeNodeToDelete = null,
        nodeToDelete = null,
        deletedNode = null;

    if (length !== 0 && index >= 0 && index < length) {
        if (index === 0) {
            this._head = currentNode.next;

            if (!this._head) {
                this._tail = null;
            } else {
                this._head.prev = null;
            }
        } else if (index === length-1) {
            this._tail = this._tail.prev;
            this._tail.next = null;
        } else {
            while (count < index) {
                currentNode = currentNode.next;
                count++;
            }

            beforeNodeToDelete = currentNode.prev;
            nodeToDelete = currentNode;
            afterNodeToDelete = currentNode.next;

            beforeNodeToDelete.next = afterNodeToDelete;
            afterNodeToDelete.prev = beforeNodeToDelete;
            deletedNode = nodeToDelete;
            nodeToDelete = null;
        }
        this._length--;
    }
    return this;
};

DoublyList.prototype.reverce = function() {
    var currentNode = this._head,
        tmp = null;

    while (currentNode) {
        tmp = currentNode.next;
        currentNode.next = currentNode.prev;
        currentNode.prev = tmp;
        if (!tmp) {
            this._head = currentNode;
        }
        currentNode = tmp;
    }
    return this;
};

DoublyList.prototype.each = function(callback) {
    var currentNode = this._head;

    if (typeof callback === 'function' && this._length !== 0) {
        while (currentNode) {
            currentNode = callback(currentNode);
            currentNode = currentNode.next;
        }
    }
    return this;
};

DoublyList.prototype.indexOf = function (data) {
    var found = false,
        currentNode = this._head,
        count = 0,
        index = -1;

    while (!found && count < this._length) {
        if (currentNode.data === data ) {
            found = true;
            index = count;
        }
        else {
            currentNode = currentNode.next;
            count++;
        }
    }
    return index;
};

/*---------- More methods ----------*/  

DoublyList.prototype.printAll = function () {
    var currentNode = this._head;
    while (currentNode) {
        console.log(currentNode);
        currentNode = currentNode.next;
    }
};

DoublyList.prototype.deleteAll = function () {
    var deletedNode = this._head.next;

    while (deletedNode) {
        next = deletedNode.next;
        deletedNode.next = null;
        deletedNode.prev = null;
        deletedNode = next;
    }
    this._head.next = null;
    this._tail.prev = null;
    this._head = null;
    this._tail = null;
    this._length = 0;
    return this;
};

DoublyList.prototype.size = function () {
    return this._length;
};


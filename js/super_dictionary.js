"use strict";

var DictItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.value = obj.value;
        this.author = obj.author;
    } else {
        this.key = "";
        this.author = "";
        this.value = "";
    }
};

DictItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var SuperDictionary = function () {
    LocalContractStorage.defineMapProperty(this, "arrayMap");
    LocalContractStorage.defineMapProperty(this, "dataMap");
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new DictItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

SuperDictionary.prototype = {
    init: function () {
        this.size = 0;
        // todo
    },

    save: function (key, value) {

        key = key.trim();
        value = value.trim();
        if (key === "" || value === "") {
            throw new Error("empty key / value");
        }
        if (value.length > 64 || key.length > 64) {
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var dictItem = this.repo.get(key);
        dictItem = new DictItem();
        dictItem.author = from;
        dictItem.key = key;
        dictItem.value = value;
        var index = this.size;
        this.arrayMap.set(index, key);
        this.dataMap.set(key, dictItem);
        // this.repo.put(key, dictItem);
        this.size += 1;
    },
    foreach(star, end) {
        if (!end) {
            return this.getOne(star);
        }
        var result = [];
        var number = end - star;
        if (number > this.size) {
            end = this.size;
        }
        for (var i = star; i < end; i++) {
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result.push(object)
        }
        return result
    },
    getAll() {
        var result = [];
        for (var i = 0; i < this.size; i++) {
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result.push(object)
        }
        return result
    },
    get: function (key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    },
    info: function () {
        return Blockchain.transaction.from;
    }
};
module.exports = SuperDictionary;
/**
 * Created by Administrator on 2017/6/28.
 */
const _ = require('underscore');

function isChinese(word) {
    const charCode = word.charCodeAt(0);
    return !(charCode >= 0 && charCode <= 128)
}

function getWordLength(word) {
    return isChinese(word) ? 2 : 1;
}

function getWordsLength(words) {
    return _.reduce(words, (m, v) => m + getWordLength(v), 0);
}

function getSpace(len) {
    return _.times(len, () => ' ').join('');
}

module.exports = {
    isChinese,
    getWordsLength,
    getWordLength,
    getSpace
};
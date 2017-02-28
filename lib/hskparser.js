'use strict';

const
  ASSETS_DIR = './assets',
  fs = require('fs'),
  path = require('path')
  ;

class HSKChunk {
  constructor(dir) {
    this.dir = dir || ASSETS_DIR;
    this.words = [];
  }

  parseLevel(level) {
    console.log("HSK | parsing level", level, "...");

    let name = 'l' + level + 'f.txt';
    let freqRank = 1;

    let lineReader = require('readline').createInterface({
      input: fs.createReadStream(path.join(this.dir, name))
    });

    lineReader.on('line', (line) => {
      let chunk = {};
      let freqRank = 1;
      let data = line.split(/\s+/);

      chunk['freq'] = freqRank;
      chunk['hanSimp'] = data[0];
      chunk['hanTrad'] = data[1];
      chunk['primitives'] = [];

      // get primitives
      {
        let w = '';
        let cnt = 0;
        for (let i in data[2]) {
          let c = data[2][i];
          if (/\d/.test(c)) {
            chunk.primitives.push({
              tone: +c,
              hanSimp: data[0][cnt],
              hanTrad: data[1][cnt],
              pinyin: w
            });
            w = '';
            ++cnt;
          } else {
            w += c;
          }
        }
      }

      if (data[3][data[3].length-1] == ',') {
        chunk['pinyin'] = data.slice(3, 5).join(' ');
        chunk['meaning'] = data.slice(5, data.length).join(' ');
      } else {
        chunk['pinyin'] = data[3];
        chunk['meaning'] = data.slice(4, data.length).join(' ');
      }

      ++freqRank;

      this.words.push(chunk);
    });

    let promise = new Promise((resolve) => {
      lineReader.on('close', resolve);
    });

    return promise;
  }

  getRandomWord() {
    return this.words[Math.floor(Math.random() * Object.keys(this.words).length)];
  }

  getWordByFreq(freq) {
    return this.words[freq];
  }
}

module.exports = HSKChunk;

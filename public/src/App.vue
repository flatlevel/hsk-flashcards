<template>
  <div id="app">
    <img id="header" src="./assets/logo.png">
    <h1></h1>
    <h2>Chinese Flash Cards</h2>
    <form id="selectHSKLevel">
      <label for="level"><strong>Select HSK Level</strong></label><br>
      Level 1 <input type="radio" name="level" value="1" v-model.number="selectedLevel">
      Level 2 <input type="radio" name="level" value="2" v-model.number="selectedLevel">
      Level 3 <input type="radio" name="level" value="3" v-model.number="selectedLevel">
      Level 4 <input type="radio" name="level" value="4" v-model.number="selectedLevel">
      Level 5 <input type="radio" name="level" value="5" v-model.number="selectedLevel">
      Level 6 <input type="radio" name="level" value="6" v-model.number="selectedLevel">
    </form>
    <button v-on:click="getRandomWord">Get New Word</button>
    <div id="hskword" v-if="loaded">
      <h1><span class="bigChar">{{hskData.hanSimp}}</span> <small>({{hskData.hanTrad}})</small></h1>
      <ul>
      <li v-for="p in primitives">
        <p>{{p.hanSimp}} <small>({{p.hanTrad}})</small> <em>{{p.pinyin}}</em> - tone {{p.tone}}</p>
      </li>
      </ul>
      <h2 id="pinyinHover"><em><span class="bigChar">{{hskData.pinyin}}</span></em> <span class="speaker"></span></h2>
      <p id="meaningHover"><em>{{hskData.meaning}}</em> <span class="speaker"></span></p>
    </div>
    <h3 v-if="!loaded">{{msg}}</h3>

    <footer>
      Problems? This app uses
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance" target="_blank">experimental</a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank">APIs</a>.
      Works best with <a href="https://www.google.com/chrome/browser/desktop/" target="_blank">Chrome 56</a> or above.
      <br><br>
      <cite><small>Made by <a href="https://github.com/flatlevel" target="_blank">flatlevel</a></small></cite>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Click the button to fetch a random character.',
      hskData: {},
      primitives: [],
      loaded: false,
      selectedLevel: 1,
      meaningText: null,
      pinyinText: null,
      zhVoice: null,
    }
  },
  created () {
    window.speechSynthesis.onvoiceschanged = () => {
      let voices = window.speechSynthesis.getVoices();
      for (let i = 0; i < voices.length; ++i) {
        if (voices[i].name === 'zh-CN') {
          this.zhVoice = voices[i];
          console.log('loaded CN');
        }
      }
    };
  },
  watch: {
    selectedLevel: function (newLevel) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let postReq = new Request('/level', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({level: +newLevel})
      });

      fetch(postReq).then(res => {
        res.json().then(json => {
          console.log(json);
        });
      });
    }
  },
  updated () {
    if (this.loaded && !this.meaningText) {
      // add event Listener
      this.meaningText = document.querySelector('#meaningHover');
      this.meaningText.addEventListener('mouseover', (ev) => {
        let meaningSpeaker = document.querySelector('#meaningHover .speaker');
        meaningSpeaker.style['opacity'] = 1.0;
        this.meaningText.style['cursor'] = 'pointer';
      });

      this.meaningText.addEventListener('mouseout', (ev) => {
        let meaningSpeaker = document.querySelector('#meaningHover .speaker');
        meaningSpeaker.style['opacity'] = 0.0;
        this.meaningText.style['cursor'] = 'auto';
      });

      this.meaningText.addEventListener('click', (ev) => {
        ev.preventDefault();

        let msg = new SpeechSynthesisUtterance(this.hskData.meaning);
        window.speechSynthesis.speak(msg);
      });
    }

    if (this.loaded && !this.pinyinText) {
      // add event Listener
      this.pinyinText = document.querySelector('#pinyinHover');
      this.pinyinText.addEventListener('mouseover', (ev) => {
        let pinyinSpeaker = document.querySelector('#pinyinHover .speaker');
        pinyinSpeaker.style['opacity'] = 1.0;
        this.pinyinText.style['cursor'] = 'pointer';
      });

      this.pinyinText.addEventListener('mouseout', (ev) => {
        let pinyinSpeaker = document.querySelector('#pinyinHover .speaker');
        pinyinSpeaker.style['opacity'] = 0.0;
        this.pinyinText.style['cursor'] = 'auto';
      });

      this.pinyinText.addEventListener('click', (ev) => {
        ev.preventDefault();

        let msg = new SpeechSynthesisUtterance(this.hskData.hanSimp);
        msg.lang = 'zh-CN';
        msg.voice = this.zhVoice;
        msg.rate = 0.8;
        window.speechSynthesis.speak(msg);
      });
    }
  },
  methods: {
    getRandomWord: function() {
      fetch(new Request('/word')).then(res => {
        res.json().then(json => {
          // console.log(json);
          if (json) {
            this.hskData = json;
            this.primitives = json.primitives;
            this.loaded = true;
          }
        });
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#header {
  width: 40%;
  height: 40%;
}

.bigChar {
  font-size: 3em;
}

.speaker {
  opacity: 0.0;
  content: url('assets/speaker.svg');
  width: .8em;
  height: .8em;
  padding-left: 5px;
  transition: opacity 300ms ease-in;
}

#hskword {
  display: block;
  margin: 0px 0px 0px 25px;
}

h1, h2 {
  font-weight: normal;
}

h1 small {
  font-size: .7em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

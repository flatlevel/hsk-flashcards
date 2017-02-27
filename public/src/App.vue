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
      <h2><em><span class="bigChar">{{hskData.pinyin}}</span></em></h2>
      <p><em>{{hskData.meaning}}</em></p>
    </div>
    <h3 v-if="!loaded">{{msg}}</h3>
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
      selectedLevel: 1
    }
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
  methods: {
    getRandomWord: function () {
      fetch(new Request('/word')).then(res => {
        res.json().then(json => {
          console.log(json);
          if (json) {
            this.hskData = json;
            this.primitives = json.primitives;
            this.loaded = true;
          } else {
            this.loaded = false;
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

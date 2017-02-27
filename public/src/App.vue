<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1></h1>
    <h2>Chinese Flash Cards</h2>
    <button v-on:click="getRandomWord">Get New Word</button>
    <div id="hskword" v-if="loaded">
      <h1>{{hskData.hanSimp}} <small>({{hskData.hanTrad}})</small></h1>
      <ul>
      <li v-for="p in primitives">
        <p>{{p.hanSimp}} <small>({{p.hanTrad}})</small> <em>{{p.pinyin}}</em> - tone {{p.tone}}</p>
      </li>
      </ul>
      <h2><em>{{hskData.pinyin}}</em></h2>
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
      loaded: false
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

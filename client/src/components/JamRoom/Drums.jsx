import React, { Component } from 'react';
import $ from 'jquery'; // TODO: is `animate` from jquery or jquery-ui?
// import { mapDrumIDToSounds } from '../utils/helperFunctions';

class Drums extends Component {
  helper(ID) {
    // Run mapDrumIDToSounds
    // document.getElementById('audiotag1').play();
    $(ID).animate({ backgroundColor: "silver" }, 50)
         .animate({ backgroundColor: "transparent" }, 50);
  }

  render() {
    return (
      <div id="userDrums">
        <img
          role="presentation"
          id="cs"
          src="../../../style/DrumParts/completeSet.png"
        />
        <div onClick={() => { this.helper("#urC"); }} id="urC" />
        <div onClick={() => { this.helper("#nextC"); }} id="nextC" />
        <div onClick={() => { this.helper("#brDrum"); }} id="brDrum" />
        <div onClick={() => { this.helper("#rsDrum"); }} id="rsDrum" />
        <div onClick={() => { this.helper("#lsDrum"); }} id="lsDrum" />
        <div onClick={() => { this.helper("#tomDrum"); }} id="tomDrum" />
        <div onClick={() => { this.helper("#urCymbal"); }} id="urCymbal" />
        <div onClick={() => { this.helper("#kickDrum"); }} id="kickDrum" />
      </div>
    );
  }
}

export default Drums;


// <audio id="audiotag1">
//         <source src="http://www.freesfx.co.uk/rx2/mp3s/3/15442_1460468286.mp3"/>
//       </audio>
//       <audio id="audiotag2">
//         <source src="http://www.freesfx.co.uk/rx2/mp3s/2/14309_1459962858.mp3"/>
//       </audio>

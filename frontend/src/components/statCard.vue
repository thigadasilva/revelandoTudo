<template>

<div class="card">

<h3>{{ titulo }}</h3>

<p class="numero">{{ valor }}</p>

</div>

</template>

<script>

export default {

props:["titulo","valor"]

}

</script>

<style>

.card{
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 2px 8px rgba(0,0,0,0.1);
width:200px;
text-align:center;
}

.numero{
font-size:28px;
font-weight:bold;
margin-top:10px;
}

</style>
<?php

// The bulk of our computation will occur here.
// Input:
//   $_POST['username']
//
// Output (json):
//   error[]
//   pie1[]
//   pie2[]
//   pie3[]
//   stream[]
//   info[]

// Include Github Functions
require 'request.php';

if(!isset($_POST['username'])) {
  $error = array(
    'msg' => 'missing POST[\'username\']'
  );
  die(json_encode(array('error' => $error)));
}

echo $_POST['username'];

?>
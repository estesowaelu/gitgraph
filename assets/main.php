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

// Require Github Functions
require 'github-api.php';

// Check that some request param is set.
if(!isset($_GET['username'])) {
  $error = array(
    'msg' => 'missing GET[\'username\']'
  );
  die(json_encode(array('error' => $error)));
}

echo github_get_everything($_GET['username']);

?>
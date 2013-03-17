<?php

require 'auth.php';

// GET /users/:user
function github_get_user($username) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/users/'.$username
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

// GET /users/:user/orgs
function github_get_user_orgs($username) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/users/'.$username.'/orgs'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

// GET /users/:user/subscriptions
function github_get_user_subscriptions($username) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/users/'.$username.'/subscriptions'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

//GET /users/:user/repos
function github_get_user_repos($username) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/users/'.$username.'/repos'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

//GET /orgs/:org/repos
function github_get_org_repos($orgname) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/orgs/'.$orgname.'/repos'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

//GET /repos/:owner/:repo/contributors  
function github_get_repo_contributors($ownername, $reponame) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/repos/'.$ownername.'/'.$reponame.'/contributors'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

//GET /repos/:owner/:repo/stargazers  
function github_get_repo_stargazers($ownername, $reponame) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/repos/'.$ownername.'/'.$reponame.'/stargazers'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}
	
// GET /repos/:owner/:repo/languages
function github_get_repo_languages($ownername, $reponame) {
  $client_id = github_get_client_id();
  $client_secret = github_get_client_secret();
  $url = 'https://api.github.com/repos/'.$ownername.'/'.$reponame.'/languages'
    .'?client_id='.$client_id
    .'&client_secret='.$client_secret;
  $json = file_get_contents($url);
  return $json;
}

function github_get_everything($username) {
  $size = 80;

  $everything = array();
  $user = json_decode(github_get_user($username), true);
  $user_orgs = json_decode(github_get_user_orgs($username), true);
  $user_repos = json_decode(github_get_user_repos($username), true);

  $everything['login'] = $user['login'];
  $everything['url'] = $user['url'];
  $everything['name'] = $user['name'];
  $everything['public_repos'] = $user['public_repos'];
  $everything['followers'] = $user['followers'];
  $everything['created_at'] = $user['created_at'];

  $everything['forks'] = 0;
  $everything['watchers'] = 0;
  $everything['languages'] = array();

  $est = array('name' => 'stargazers', 'children' => array());
  $egr = array('name' => 'groupies', 'children' => array());
  $esu = array('name' => 'subscriptions', 'children' => array());
  $everything['relations'] = array(
    'name' => 'relations',
    'children' => array($est, $egr, $esu)
  );

  $subscriptions = json_decode(github_get_user_subscriptions($user['login']), true);
  foreach($subscriptions as $s) {
    $everything['relations']['children'][2]['children'][] = array('name' => $s['owner']['login'], 'size' => $size);
  }

  $everything['repos'] = array();
  foreach($user_repos as $urepo) {
    $langs = json_decode(github_get_repo_languages($user['login'], $urepo['name']), true);
    foreach($langs as $l => $v) {
      $everything['languages'][$l] += $v;
    }
    $stars = json_decode(github_get_repo_stargazers($user['login'], $urepo['name']), true);
    foreach($stars as $s) {
      $everything['relations']['children'][0]['children'][] = array('name' => $s['login'], 'size' => $size);
    }     
    $everything['forks'] += $urepo['forks'];
    $everything['watchers'] += $urepo['watchers'];
    $everything['repos'][] = array(
      'owner' => $urepo['owner']['login'],
      'name' => $urepo['name'],
      'full_name' => $urepo['full_name'],
      'url' => $urepo['url'],
      'language' => $urepo['language'],
      'forks' => $urepo['forks'],
      'watchers' => $urepo['watchers'],
      'size' => $urepo['size'],
      'pushed_at' => $urepo['pushed_at'],
      'created_at' => $urepo['created_at'],
      'updated_at' => $urepo['updated_at']
    );
  }

  $everything['orgs'] = array();
  $everything['orgrepos'] = array();
  foreach($user_orgs as $org) {
    // Populate org data
    $everything['orgs'][] = array(
      'login' => $org['login'],
      'url' => $org['url']
    );

    // Populating Org Repos
    $org_repos = json_decode(github_get_org_repos($org['login']), true);
    foreach($org_repos as $orepo) {
      // Check for contributions
      $numcon = 0;
      $didcon = false;
      $con = json_decode(github_get_repo_contributors($org['login'], $orepo['name']), true);
      foreach($con as $c) {
        if($c['login'] == $user['login']) {
	  $didcon = true;
          $numcon = $c['contributions'];
        } else {
	  $everything['relations']['children'][1]['children'][] = array('name' => $c['login'], 'size' => $size);
	}		
      }
      if($didcon) {
        $langs = json_decode(github_get_repo_languages($org['login'], $orepo['name']), true);
        foreach($langs as $l => $v) {
          $everything['languages'][$l] += $v;
        }
        $stars = json_decode(github_get_repo_stargazers($org['login'], $orepo['name']), true);
        foreach($stars as $s) {
	    $everything['relations']['children'][0]['children'][] = array('name' => $s['login'], 'size' => $size);
        }

        $everything['forks'] += $orepo['forks'];
        $everything['watchers'] += $orepo['watchers'];
        $everything['orgrepos'][] = array(
          'owner' => $orepo['owner']['login'],
  	  'name' => $orepo['name'],
  	  'full_name' => $orepo['full_name'],
	  'url' => $orepo['url'],
	  'language' => $orepo['language'],
	  'forks' => $orepo['forks'],
	  'watchers' => $orepo['watchers'],
	  'size' => $orepo['size'],
	  'pushed_at' => $orepo['pushed_at'],
	  'created_at' => $orepo['created_at'],
	  'updated_at' => $orepo['updated_at'],
	  'contributions' => $numcon
        ); 
      } 
    }

    // After everything globals
    $everything['contributed_repos'] = sizeof($everything['orgrepos']);
  }

  echo json_encode($everything);  
}

?>

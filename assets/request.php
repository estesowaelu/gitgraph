<?php
/* gets url */
function get_content_from_github($url) {
	
  $ch = curl_init();
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); 

  $content = curl_exec($ch);
 
   if ($error = curl_error($ch))
   {
	   $content = $error;
   }
	curl_close($ch);
	return $content;
}

// API call through curl
$json = get_content_from_github('https://api.github.com/users/estesowaelu');

// JSON now decode into array
$decoded = json_decode($json,true);

// spitting out 1 value of the array to the screen
echo($decoded['login'].'<br><br>');

// here's so you an see what is in the array
    foreach ($decoded as $key => $value){
        echo "$key: $value\n<br/>";
    };
	
?>

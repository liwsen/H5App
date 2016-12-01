<?php
	$data = array();
	$data['status'] = 1;
	$data['data'] = $_POST;
	$data['msg'] = 'success';
	echo json_encode($data);
?>
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";

import { Post } from '../components/Post';
import { fetchNamePosts, fetchPosts } from '../redux/slices/posts';

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const { posts } = useSelector(state => state.posts);

	const isPostsLoading = posts.status === 'loading';

	React.useEffect(() => {
		dispatch(fetchPosts('all'));
	}, []);

	function calcPosts() {
		let posts = document.querySelector('.posts');

		if (posts.children.length == 0) {
			alert('Нет подходящих заявок!')
		}
	}

	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);

		if (newValue == 1) {
			dispatch(fetchPosts('waiting'));
		} else if (newValue == 2) {
			dispatch(fetchPosts('beingdone'));
		} else if (newValue == 0) {
			dispatch(fetchPosts('all'));
		} else if (newValue == 3) {
			dispatch(fetchPosts('done'));
		} else if (newValue == 4) {
			dispatch(fetchPosts('declined'));
		}
		setTimeout(calcPosts, 500);
	};

	function resetToNew() {
		dispatch(fetchPosts('all'));
	}

	function sortByBookName() {
		let value = getSearchInput();
		setValue(0);
		if (value) {
			dispatch(fetchNamePosts(value));
		} else {
			dispatch(fetchPosts('all'));
		}
	}

	function getSearchInput() {
		let input = document.querySelector('.search input');
		return input.value;
	}

	function createHomeContent() {
		if (userData?._id) {
			if (userData?.role == 0) {
				let userPosts = 0;
				posts.items.forEach((obj, index) => {
					if (userData?._id === obj.user?._id) {
						userPosts++;
						return;
					}
				})
				if (userPosts == 0) {
					return <p className='noapplies'>На данный момент нет заявок от вашего имени! Опубликовать заявку вы можете по одноимённой кнопке вверху экрана.</p>
				} else {
					return <Grid className='posts' item>
						{(isPostsLoading ? [...Array(6)] : posts.items).map((obj, index) =>
							isPostsLoading ? (
								<Post key={index} isLoading={true} />
							)
								: (
									userData?._id === obj.user._id && (
										< Post
											id={obj._id}
											title={obj.title}
											imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
											user={obj.user}
											createdAt={obj.createdAt.slice(0, 10)}
											inventory={obj.inventory}
											isEditable={userData?._id === obj.user._id}
											status={obj.status}
											worker={obj.worker}
											num={obj.num}
											text={obj.text}
										/>)
								))}
					</Grid>
				}
			} else if (userData?.role == 1 || userData?.role == 2) {
				return <Grid className='posts' item>
					{(isPostsLoading ? [...Array(6)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						)
							: (
								< Post
									id={obj._id}
									title={obj.title}
									imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
									user={obj.user}
									createdAt={obj.createdAt.slice(0, 10)}
									inventory={obj.inventory}
									isEditable={userData?._id === obj.user._id}
									status={obj.status}
									worker={obj.worker}
									num={obj.num}
									text={obj.text}
								/>
							))}
				</Grid>
			}
		} else {
			return <p className='noauth'>Войдите или зарегистрируйтесь чтобы подать или модерировать заявки!</p>
		}
	}

	return (
		<>
			<Grid className='noprint'>
				{(userData?.role === 1 || userData?.role === 2) && (
					<Grid container rowSpacing={1}>
						<Grid item>

							<Tabs value={value} onChange={handleChange} style={{ marginBottom: 15 }}>
								<Tab onClick={resetToNew} label="Все заявки" />
								<Tab label="Ожидают" />
								<Tab label="В работе" />
								<Tab label="Выполнены" />
								<Tab label="Отклонены" />
							</Tabs>

						</Grid>
						<Grid item style={{ marginLeft: 'auto' }}>
							<TextField style={{ marginBottom: 25 }} className='search' type="text" label="Поиск по названию" onInput={sortByBookName}
							/>
						</Grid>
					</Grid>
				)}
			</Grid >
			<Grid>
				{createHomeContent()}
			</Grid>
		</>
	);
};

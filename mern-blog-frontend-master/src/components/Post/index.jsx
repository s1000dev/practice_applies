import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';

export const Post = ({
	id,
	title,
	createdAt,
	imageUrl,
	user,
	inventory,
	children,
	isFullPost,
	isLoading,
	isEditable,
	status,
	worker,
	num,
	text,
}) => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);

	if (isLoading) {
		return <PostSkeleton />;
	}


	const onClickRemove = () => {
		if (window.confirm('Вы действительно хотите удалить заявку?')) {
			dispatch(fetchRemovePost(id));
		}
	};

	function createStatus() {
		if (status == 0) {
			return <div><p className={styles.statusRed}>Ожидает</p></div>;
		} else if (status == 1) {
			return <div><p className={styles.statusYellow}>В работе</p></div>;
		} else if (status == 2) {
			return <div><p className={styles.statusGreen}>Выполнена</p></div>;
		} else if (status == 3) {
			return <div><p className={styles.statusBlack}>Отклонена</p></div>;
		}
	}

	let editPost;

	if ((status == 0 || status == 1) && userData?.role != 0) {
		editPost = true;
	} else {
		editPost = false;
	}

	return (
		<div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
			<div className={styles.wrapper}>
				<Grid className={styles.top} container rowSpacing={1}>
					<div>Заявка № {num}</div>
					<Grid className={styles.btns}>
						<div className={styles.editButtons}>
							{editPost && (
								<Link to={`/posts/${id}/edit`}>
									<IconButton color="primary">
										<EditIcon />
									</IconButton>
								</Link>
							)}
							{userData?.role == 2 && (
								<IconButton onClick={onClickRemove} color="secondary">
									<DeleteIcon />
								</IconButton>
							)}
						</div>
						{createStatus()}
					</Grid>
				</Grid>
				<UserInfo {...user} additionalText={createdAt} />
				<div className={styles.indention}>
					<h2 className={clsx(styles.title)}>
						{title}
					</h2>
				</div>
				<p><strong>Инвентарный номер:</strong> {inventory}.</p>
				<p><strong>Рабочий:</strong> {worker}.</p>
				<div>
					<strong>Фото:</strong>&nbsp;
					{imageUrl ? (
						<a className={clsx(styles.yesphoto)} href={imageUrl} target='_blank'>Открыть в новом окне.</a>
					) : (
						<p className={clsx(styles.nophoto)}>не приложено.</p>
					)}
				</div>
				<div className={styles.text}><p><strong>Текст заявки:</strong> {String(text)}.</p></div>
			</div>

		</div >
	);
};

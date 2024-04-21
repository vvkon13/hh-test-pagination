import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { GetServerSidePropsContext } from "next";
import Pagination from "react-bootstrap/Pagination";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[]; // Массив пользователей
  total: number; // Общее количество записей
  page: number; // Текущая страница
  totalPages: number; // Всего страниц
}


export const getServerSideProps = async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const page = ctx.query.page ? parseInt(ctx.query.page as string) : 1; // Убедимся в коррекности преобразования типов
    const take = 20;

    const res = await fetch(`http://localhost:3000/users?page=${page}&take=${take}`, { method: 'GET' });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], total: 0, page: 0, totalPages: 0 } };
    }

    const data = await res.json();
    return {
      props: {
        statusCode: 200,
        users: data.data || [], // Предотвратить undefined для users
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 0,
      }
    }
  } catch (e) {
    console.error(e);
    return { props: { statusCode: 500, users: [], total: 0, page: 0, totalPages: 0 } };
  }
}




export default function Home({ statusCode, users, page, totalPages }: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  const firstPage = 1;
  const lastPage = totalPages;
  const startPage = page > 5 ? Math.max(Math.min(page - 5, totalPages - 9), 1) : 1;
  const endPage = page > 5 ? Math.min(page + 4, totalPages) : Math.min(10, totalPages);

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.updatedAt}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First href={`?page=${firstPage}`} disabled={page === firstPage} />
            <Pagination.Prev href={`?page=${Math.max(page - 1, firstPage)}`} disabled={page === firstPage} />

            {Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx)
              .map((pageIndex) => (
                <Pagination.Item
                  key={pageIndex}
                  active={pageIndex === page}
                  href={`?page=${pageIndex}`}
                >
                  {pageIndex}
                </Pagination.Item>
              ))}

            <Pagination.Next href={`?page=${Math.min(page + 1, lastPage)}`} disabled={page === lastPage} />
            <Pagination.Last href={`?page=${lastPage}`} disabled={page === lastPage} />
          </Pagination>

        </Container>
      </main>
    </>
  );
}

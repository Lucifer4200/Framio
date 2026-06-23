import { Image, Table } from "@mantine/core";

interface INoTableDataProps {
  colSpan: number;
  imgClass?: string;
  titleClass?: string;
  title?: string;
  imageUrl?: string;
}

const NoTableData = ({
  colSpan = 5,
  imgClass = "w-auto my-10",
  titleClass = "h2 text-v2foreground dark:text-white mb-10",
  title = "No data available yet!",
  imageUrl = "https://static.vecteezy.com/system/resources/previews/025/343/104/original/empty-folder-no-result-document-file-data-not-found-concept-empty-state-ui-infographic-vector.jpg",
}: INoTableDataProps) => {
  return (
    <Table.Tr className="table-no-data">
      <Table.Td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center">
          <Image
            src={imageUrl}
            fit="contain"
            className={`${imgClass}`}
          />
          <div className={`${titleClass}`}>{title}</div>
        </div>
      </Table.Td>
    </Table.Tr>
  );
};

export default NoTableData;

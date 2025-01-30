"use client"
import React, { useState, useEffect } from "react";
import { Upload, Button, Table, Input, message, Spin, Popconfirm } from "antd";
import { UploadOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link"; // Next.js Link for redirection
import { fetchAPI } from "@/utils/fetch";
import { FETCH_CONTACTS, UPLOAD_CONTACTS } from "@/constants";

const UploadExcel = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [search, setSearch] = useState("");

  // Fetch contacts
  const fetchContacts = async (page = 1, limit = 5, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchAPI(
        `${FETCH_CONTACTS}?page=${page}&limit=${limit}&search=${searchQuery}`,
        "GET"
      );

      setContacts(response.contacts || []);
      setPagination({
        current: page,
        pageSize: limit,
        total: response.total || 0,
      });
    } catch (error) {
      message.error("Failed to fetch contacts.");
      console.error("Error fetching contacts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetchAPI(UPLOAD_CONTACTS, "POST", formData);
      message.success("File uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload file.");
      console.error("Error uploading file:", error.message);
    } finally {
      await fetchContacts();
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchContacts(pagination.current, pagination.pageSize, value);
  };

  // Handle table pagination
  const handleTableChange = (pagination) => {
    fetchContacts(pagination.current, pagination.pageSize, search);
  };

  // Handle delete contact
  const handleDelete = async (contactId) => {
    try {
      await fetchAPI(`/api/contacts/${contactId}`, "DELETE");
      message.success("Contact deleted successfully!");
      fetchContacts(); // Fetch contacts again after deletion
    } catch (error) {
      message.error("Failed to delete contact.");
      console.error("Error deleting contact:", error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Link href={`/edit-contact/${record.id}`} passHref>
            <Button
              icon={<EditOutlined />}
              className="mr-2"
            >
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];
  const uploadProps = {
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error("You can only upload Excel files!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await handleFileUpload(file);
        onSuccess("ok");
      } catch (error) {
        onError(error);
      }
    },
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Contacts & View</h2>

        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={loading} className="w-full bg-blue-500 text-white hover:bg-blue-600 mb-6">
            Upload Excel
          </Button>
        </Upload>

        <Input
          prefix={<SearchOutlined />}
          placeholder="Search contacts"
          value={search}
          onChange={handleSearch}
          className="mb-4"
        />

        {loading ? (
          <Spin size="large" className="w-full flex justify-center" />
        ) : (
          <Table
            columns={columns}
            dataSource={contacts}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
            rowKey={(record) => record.id}
          />
        )}
      </div>
    </div>
  );
};

export default UploadExcel;

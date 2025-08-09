import { useState, useEffect } from 'react'
import { Card, Button, Modal, Form, Input, Select, InputNumber, Switch, Rate, message, Row, Col, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Toy } from '../entities/Toy'

const { Option } = Select

function ToyApp() {
  const [toys, setToys] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingToy, setEditingToy] = useState(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const categories = [
    'Action Figure',
    'Doll',
    'Educational',
    'Building Blocks',
    'Board Game',
    'Vehicle',
    'Plush Toy',
    'Puzzle',
    'Arts & Crafts',
    'Electronic',
    'Outdoor',
    'Musical'
  ]

  const loadToys = async () => {
    try {
      setLoading(true)
      const result = await Toy.list()
      if (result.success) {
        setToys(result.data)
      }
    } catch (error) {
      message.error('Failed to load toys')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToy = () => {
    setEditingToy(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditToy = (toy) => {
    setEditingToy(toy)
    form.setFieldsValue(toy)
    setIsModalVisible(true)
  }

  const handleDeleteToy = async (toyId) => {
    try {
      const result = await Toy.update(toyId, { deleted: true })
      if (result.success) {
        message.success('Toy deleted successfully!')
        loadToys()
      }
    } catch (error) {
      message.error('Failed to delete toy')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingToy) {
        const result = await Toy.update(editingToy._id, values)
        if (result.success) {
          message.success('Toy updated successfully!')
        }
      } else {
        const result = await Toy.create(values)
        if (result.success) {
          message.success('Toy added successfully!')
        }
      }
      setIsModalVisible(false)
      loadToys()
    } catch (error) {
      message.error('Failed to save toy')
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Action Figure': 'red',
      'Doll': 'pink',
      'Educational': 'green',
      'Building Blocks': 'blue',
      'Board Game': 'purple',
      'Vehicle': 'orange',
      'Plush Toy': 'magenta',
      'Puzzle': 'cyan',
      'Arts & Crafts': 'lime',
      'Electronic': 'geekblue',
      'Outdoor': 'gold',
      'Musical': 'volcano'
    }
    return colors[category] || 'default'
  }

  useEffect(() => {
    loadToys()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧸 Toy Collection</h1>
          <p className="text-gray-600">Manage your amazing toy inventory</p>
        </div>

        <div className="mb-6">
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={handleAddToy}
            className="shadow-lg"
          >
            Add New Toy
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {toys.map((toy) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={toy._id}>
              <Card
                hoverable
                className="shadow-lg h-full"
                cover={
                  toy.imageUrl ? (
                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={toy.imageUrl} 
                        alt={toy.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-6xl">🧸</div>
                    </div>
                  )
                }
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEditToy(toy)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDeleteToy(toy._id)} />,
                  <ShoppingCartOutlined key="cart" />
                ]}
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{toy.name}</h3>
                    <Tag color={getCategoryColor(toy.category)}>{toy.category}</Tag>
                  </div>
                  
                  <div className="space-y-2">
                    {toy.ageRange && (
                      <div className="text-sm text-gray-600">
                        <strong>Age:</strong> {toy.ageRange}
                      </div>
                    )}
                    
                    <div className="text-lg font-bold text-green-600">
                      ${toy.price?.toFixed(2) || '0.00'}
                    </div>
                    
                    {toy.rating && (
                      <div className="flex items-center space-x-2">
                        <Rate disabled value={toy.rating} className="text-sm" />
                        <span className="text-sm text-gray-600">({toy.rating})</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Tag color={toy.inStock ? 'green' : 'red'}>
                        {toy.inStock ? 'In Stock' : 'Out of Stock'}
                      </Tag>
                    </div>
                  </div>
                  
                  {toy.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{toy.description}</p>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {toys.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧸</div>
            <h3 className="text-xl text-gray-600 mb-2">No toys in your collection yet!</h3>
            <p className="text-gray-500 mb-6">Add some toys to get started</p>
            <Button type="primary" size="large" onClick={handleAddToy}>
              Add Your First Toy
            </Button>
          </div>
        )}

        <Modal
          title={editingToy ? 'Edit Toy' : 'Add New Toy'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-6"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Toy Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter toy name!' }]}
                >
                  <Input placeholder="Enter toy name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: 'Please select category!' }]}
                >
                  <Select placeholder="Select category">
                    {categories.map(cat => (
                      <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Price ($)"
                  name="price"
                  rules={[{ required: true, message: 'Please enter price!' }]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    className="w-full"
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Age Range"
                  name="ageRange"
                >
                  <Input placeholder="e.g., 3-8 years" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Rating"
                  name="rating"
                >
                  <Rate />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="In Stock"
                  name="inStock"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Image URL"
              name="imageUrl"
            >
              <Input placeholder="https://example.com/toy-image.jpg" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Enter toy description..."
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingToy ? 'Update Toy' : 'Add Toy'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default ToyApp